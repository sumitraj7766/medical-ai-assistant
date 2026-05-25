import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are a medical AI assistant.

Only answer healthcare questions.

If unrelated question asked,
say:
"I only provide medical assistance."
          `,
        },
        {
          role: "user",
          content: body.message,
        },
      ],

      model: "llama-3.3-70b-versatile",
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