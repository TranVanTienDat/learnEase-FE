import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_URL;

export type ChatbotResponse = {
  status: string;
  data: { content: string };
};

export const chatbotApi = {
  askQuestion: async ({
    content,
    id,
  }: {
    content: string;
    id: string;
  }): Promise<ChatbotResponse> => {
    try {
      const response = await axios.post(`${BASE_URL}/v1/chat`, {
        question: content,
        id: id,
      });
      return response.data;
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      throw error;
    }
  },
};
