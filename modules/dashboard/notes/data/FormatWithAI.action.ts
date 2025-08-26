"use server";

export async function formatToMarkdownWithAI(
  content: string
): Promise<{ success: boolean; formattedContent: string }> {
  if (!content.trim()) return { success: false, formattedContent: content };

  const apiKey = process.env.GOOGLE_CLIENT_AI;
  if (!apiKey) {
    return { success: false, formattedContent: content };
  }

  // More precise prompt that preserves original content
  const prompt = `Convert the following text to proper markdown formatting. 

IMPORTANT RULES:
- DO NOT add any new content, explanations, or text that wasn't in the original
- DO NOT add introductory or concluding sentences
- ONLY apply markdown formatting to the existing text
- Use # for main headings, ## for subheadings, ### for smaller headings
- Use - or * for bullet points where appropriate
- Use \`code\` for inline code and \`\`\`language blocks for code snippets
- Use **bold** and *italic* where it makes sense
- Preserve all original meaning and content exactly

Text to format:
${content}`;

  try {
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
          generationConfig: {
            maxOutputTokens: 2048, // Increased for longer content
            temperature: 0.1, // Lower temperature for more consistent formatting
            topP: 0.8, // More focused responses
            topK: 10, // More deterministic
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from AI API:", errorText);
      return { success: false, formattedContent: content };
    }

    const data = await response.json();

    // Better error handling for the response structure
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      console.error("Unexpected API response structure:", data);
      return { success: false, formattedContent: content };
    }

    const formattedContent =
      data.candidates[0].content.parts[0]?.text || content;

    // Basic validation - if formatted content is much longer than original, something went wrong
    if (formattedContent.length > content.length * 1.5) {
      console.warn(
        "Formatted content significantly longer than original, using original"
      );
      return { success: false, formattedContent: content };
    }

    return { success: true, formattedContent };
  } catch (error) {
    console.error("Error in formatToMarkdownWithAI:", error);
    return { success: false, formattedContent: content };
  }
}
