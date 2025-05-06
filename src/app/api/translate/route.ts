import { NextRequest } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { data, targetLanguage } = await req.json();

    if (!Array.isArray(data)) {
      return new Response(
        JSON.stringify({ message: "Invalid data format. Expected an array." }),
        { status: 400 }
      );
    }

    const translatedArray = await Promise.all(
      data.map(async (obj: Record<string, any>) => {
        const entries = await Promise.all(
          Object.entries(obj).map(async ([key, value]) => {
            // If the key is 'refnr', or value is not a string, don't translate
            if (key === "refnr" || typeof value !== "string") {
              return [key, value];
            }

            const completion = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: `Translate the following text to ${targetLanguage}, without changing its meaning.`,
                },
                {
                  role: "user",
                  content: value,
                },
              ],
              temperature: 0.3,
            });

            const translatedValue =
              completion.choices[0]?.message?.content?.trim() || value;
            return [key, translatedValue];
          })
        );

        return Object.fromEntries(entries);
      })
    );

    return new Response(JSON.stringify({ data: translatedArray }), {
      status: 200,
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return new Response(
      JSON.stringify({ message: "Translation failed", error: error.message }),
      { status: 500 }
    );
  }
}
