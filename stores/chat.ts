import { v4 as uuidv4 } from "uuid";
import { createPersistStore } from "./store";
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

      onUserInput(content: string) {
        const message: ChatMessage = createMessage({
          role: "user",
          content: content,
        });

        get().onNewMessage(message);
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
