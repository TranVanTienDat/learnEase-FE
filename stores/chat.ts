import { v4 as uuidv4 } from "uuid";
import { createPersistStore } from "./store";
import { chatbotApi } from "@/apiRequest/chatbot";
import { TogetherAI } from "@/provider/togetherAI";
import { estimateTokenLength } from "@/utils/token";

const MODEL_TOKEN_LIMIT = 500;
const OUTPUT_TOKEN_LIMIT = 200;
const INPUT_TOKEN_LIMIT = MODEL_TOKEN_LIMIT - OUTPUT_TOKEN_LIMIT;
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

function removeTags(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  streaming?: boolean;
  isError?: boolean;
  date?: string;
  messageError?: string;
};

export interface ChatStat {
  tokenCount: number;
  wordCount: number;
  charCount: number;
}

export interface ChatSession {
  //   id: string;
  memoryPrompt: string;
  messages: ChatMessage[];
  lastUpdate: number;
  stat: ChatStat;
}

export function createMessage(override: Partial<ChatMessage>): ChatMessage {
  return {
    id: uuidv4(),
    date: new Date().toLocaleString(),
    role: "user",
    content: "",
    ...override,
  };
}

export const BOT_HELLO: ChatMessage = createMessage({
  role: "assistant",
  content: "Xin chào bạn! Tôi là trợ lý ảo của bạn. Bạn cần tôi giúp gì?",
});

function createEmptySession(): ChatSession {
  return {
    memoryPrompt: "",
    messages: [],
    stat: {
      tokenCount: 0,
      wordCount: 0,
      charCount: 0,
    },
    lastUpdate: Date.now(),
  };
}

const DEFAULT_CHAT_STATE = {
  session: createEmptySession(),
  lastInput: "",
};

export const useChatStore = createPersistStore(
  DEFAULT_CHAT_STATE,
  (set, _get) => {
    function get() {
      return {
        ..._get(),
        ...methods,
      };
    }

    const methods = {
      onNewMessage(message: ChatMessage) {
        const session = get().session;

        session.messages = [...session.messages, message];
        session.lastUpdate = Date.now();

        set(() => ({
          session,
        }));
      },

      async onUserInput(content: string) {
        const message: ChatMessage = createMessage({
          role: "user",
          content: content,
        });

        get().onNewMessage(message);
        let botMessage: ChatMessage = createMessage({
          role: "assistant",
          streaming: true,
          content: "",
        });
        get().onNewMessage(botMessage);

        const messagePrompt = get().session.memoryPrompt
          ? get().session.memoryPrompt + "\n" + content
          : content;

        try {
          const response = await chatbotApi.askQuestion(messagePrompt);

          botMessage = {
            ...botMessage,
            streaming: false,
            content: response.data.content,
          };
        } catch (error: any) {
          console.error("Error:", error);
          botMessage = {
            ...botMessage,
            streaming: false,
            isError: true,
            messageError:
              error?.response?.data?.message ||
              error?.message ||
              "Có lỗi xảy ra, vui lòng thử lại sau",
          };
        } finally {
          get().updateMessage(botMessage);
        }

        get().summarizeSessionSimple(get().session);
      },

      updateMessage(messageItem: ChatMessage) {
        const session = get().session;
        const messages = session.messages;

        const messageIndex = messages.findIndex(
          (msg) => msg.id === messageItem.id
        );
        if (messageIndex !== -1) {
          messages[messageIndex] = {
            ...messages[messageIndex],
            ...messageItem,
          };

          session.lastUpdate = Date.now();
          set(() => ({
            session: {
              ...session,
              messages: [...messages],
            },
          }));

          return true;
        }
        return false;
      },

      getMessagesWithMemory(): ChatMessage[] {
        const session = get().session;
        const messages = session.messages;

        if (session.memoryPrompt && messages.length > 0) {
          const systemMessage = createMessage({
            role: "assistant",
            content: session.memoryPrompt,
          });
          return [systemMessage].concat(messages);
        }

        return messages;
      },

      setLastInput(lastInput: string) {
        set({
          lastInput,
        });
      },

      getSession(): ChatSession {
        return get().session;
      },

      async summarizeSessionSimple(session: ChatSession) {
        const now = Date.now();
        if (now - session.lastUpdate > TEN_DAYS_MS) {
          session.lastUpdate = now;
          session.memoryPrompt = "";
        }

        if (!session || session.messages.length === 0) {
          console.log("[Summarize] Empty session.");
          return;
        }

        // 1. Lọc valid messages
        let validMessages = session.messages.filter(
          (msg) => !msg.isError && msg.content.trim().length > 0
        );

        if (validMessages.length === 0) {
          console.log("[Summarize] No valid messages.");
          return;
        }

        // 2. Cắt bớt message nếu tổng token vượt
        let totalTokens = validMessages.reduce(
          (sum, msg) => sum + estimateTokenLength(msg.content),
          0
        );

        while (totalTokens > INPUT_TOKEN_LIMIT && validMessages.length > 1) {
          validMessages.shift(); // bỏ tin nhắn cũ nhất
          totalTokens = validMessages.reduce(
            (sum, msg) => sum + estimateTokenLength(msg.content),
            0
          );
        }

        // 3. Ghép thêm system prompt yêu cầu tóm tắt
        validMessages.push({
          id: Date.now().toString(),
          role: "system",
          content:
            "Please summarize the conversation above in less than 200 tokens. Be concise and highlight important points.",
        });

        const promptMessages = validMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const llm = new TogetherAI();
        try {
          const response = await llm.chat(promptMessages);

          if (!response) return;
          const summarizedContent = response.choices[0].message.content;

          session.memoryPrompt = removeTags(summarizedContent);
          session.lastUpdate = Date.now();
        } catch (error) {
          console.error("[Summarize Error]", error);
        }
      },

      resetSession() {
        set(() => ({
          session: createEmptySession(),
          lastInput: "",
        }));
      },
    };

    return methods;
  },

  {
    name: "chatbot-chat",
  }
);
