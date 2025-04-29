import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_URL;

export const chatbotApi = {
  askQuestion: async (question: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/chatbot`, {
        question: question,
      });
      return response.data;
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      throw error;
    }
  },
};
