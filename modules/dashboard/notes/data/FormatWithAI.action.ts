"use server";

export async function formatToMarkdownWithAI(
  content: string
): Promise<{ success: boolean; formattedContent: string }> {
  if (!content.trim()) return { success: false, formattedContent: content };

  const apiKey = process.env.GOOGLE_CLIENT_AI;
  if (!apiKey) {
    return { success: false, formattedContent: content };
  }

  const prompt = `Format the following text in markdown format with appropriate headings, subheadings, bullet points, and code blocks where necessary. Ensure clarity and readability.\n\n${content}`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        // optional config
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        },
      }),
    }
  );

  if (!response.ok) {
    console.error("Error response from AI API:", await response.text());
    return { success: false, formattedContent: content };
  }

  const data = await response.json();
  const formattedContent =
    data.candidates?.[0]?.content?.parts?.[0]?.text || content;

  return { success: true, formattedContent };
}

// "use server";
// export async function formatToMarkdownWithAI(
//   content: string
// ): Promise<{ sucess: boolean; formattedContent: string }> {
//   if (!content.trim()) return { sucess: false, formattedContent: content };

//   const apiKey = process.env.GOOGLE_CLIENT_AI;
//   if (!apiKey)
//     throw new Error("Google API key is not set in environment variables");
//   const prompt = `Format the following text in markdown format with appropriate headings, subheadings, bullet points, and code blocks where necessary. Ensure clarity and readability.\n\n${content}`;
//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-goog-api-key": apiKey,
//       },
//       body: JSON.stringify({
//         prompt: {
//           text: prompt,
//         },
//         maxOutputTokens: 1024,
//         temperature: 0.7,
//         topP: 0.95,
//         topK: 40,
//       }),
//     }
//   );
//   if (!response.ok) {
//     console.error("Error response from AI API:", await response.text());
//     return { sucess: false, formattedContent: content };
//   }
//   const data = await response.json();
//   const formattedContent = data.candidates[0].output.text;
//   return { sucess: true, formattedContent };
// }
