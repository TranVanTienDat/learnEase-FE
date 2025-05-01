import Together from "together-ai";

export class TogetherAI {
  private client: Together;
  private model: string;

  constructor(
    apiKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
    model = "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free"
  ) {
    this.client = new Together({ apiKey });
    this.model = model;
  }

  async chat(msgs: any): Promise<any> {
    try {
      const params: Together.Chat.CompletionCreateParams = {
        messages: [...msgs],
        model: this.model,
      };

      const chatCompletion = await this.client.chat.completions.create(params);
      return chatCompletion;
    } catch (error) {
      console.error("TogetherAI Error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
}
