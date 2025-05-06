import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_URL;

export async function POST(request: Request) {
  const { question } = await request.json();

  const response = await fetch(`${BASE_URL}/v1/chatbot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.body) {
    return new Response("No body in response", { status: 500 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
