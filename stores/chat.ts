import { v4 as uuidv4 } from "uuid";
import { createPersistStore } from "./store";
import { chatbotApi } from "@/apiRequest/chatbot";
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  isError?: boolean;
  date?: string;
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

        try {
          const response = await chatbotApi.askQuestion(content);

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
            content:
              error?.response?.data?.message ||
              error?.message ||
              "Có lỗi xảy ra, vui lòng thử lại sau",
          };
        } finally {
          get().updateMessage(botMessage);
        }
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
    };

    return methods;
  },

  {
    name: "chatbot-chat",
  }
);
