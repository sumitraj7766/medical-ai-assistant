import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const completion = await client.chat.completions.create({

      model: "meta-llama/llama-3.3-70b-instruct",

      messages: [

        {
          role: "system",
          content: `
You are a medical AI assistant.

Only answer healthcare-related questions.

If user asks unrelated questions, reply:
"I only provide medical assistance."

Never provide final diagnosis.
Always recommend consulting a doctor for serious symptoms.
          `,
        },

        {
          role: "user",
          content: body.message,
        },

      ],

    });

    return Response.json({
      response:
        completion.choices[0]?.message?.content,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      response: "Something went wrong.",
    });

  }

}