import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages,
      temperature: 0.2,
      max_tokens: 4000,
      top_p: 1,
      n: 1
    });

    const responseMessage = completion.choices[0].message;
    return NextResponse.json({ message: responseMessage.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export const GET = () =>
  NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
