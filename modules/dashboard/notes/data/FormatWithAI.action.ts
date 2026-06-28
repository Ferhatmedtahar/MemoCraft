"use server";

import { callGemini } from "@/lib/gemini";
import { checkAndUpdateAIUsage } from "@/lib/ai-usage";

export async function formatToMarkdownWithAI(content: string): Promise<{
  success: boolean;
  formattedContent: string;
  message?: string;
  remainingRequests?: number;
}> {
  if (!content.trim()) {
    return {
      success: false,
      formattedContent: content,
      message: "No content provided",
    };
  }

  const usageCheck = await checkAndUpdateAIUsage();
  if (!usageCheck.success || !usageCheck.canUseAI) {
    return {
      success: false,
      formattedContent: content,
      message: usageCheck.message,
      remainingRequests: usageCheck.remainingRequests || 0,
    };
  }

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
    const formattedContent = await callGemini(prompt, {
      temperature: 0.1,
      topK: 10,
      maxOutputTokens: 2048,
    });

    if (formattedContent.length > content.length * 1.5) {
      console.warn(
        "Formatted content significantly longer than original, using original"
      );
      return {
        success: false,
        formattedContent: content,
        message: "Formatting validation failed",
        remainingRequests: usageCheck.remainingRequests,
      };
    }

    return {
      success: true,
      formattedContent,
      message: "Content formatted successfully",
      remainingRequests: usageCheck.remainingRequests,
    };
  } catch (error) {
    console.error("Error in formatToMarkdownWithAI:", error);
    return {
      success: false,
      formattedContent: content,
      message: "An unexpected error occurred",
      remainingRequests: usageCheck.remainingRequests,
    };
  }
}

export async function chatWithAI(
  noteContent: string,
  userMessage: string,
  conversationHistory: any[] = []
) {
  try {
    const usageCheck = await checkAndUpdateAIUsage();
    if (!usageCheck.success || !usageCheck.canUseAI) {
      return {
        success: false,
        message: usageCheck.message,
        remainingRequests: usageCheck.remainingRequests || 0,
      };
    }

    let conversationText = "";
    if (conversationHistory.length > 0) {
      conversationText = conversationHistory
        .map(
          (msg) =>
            `${msg.role === "user" ? "Student" : "Assistant"}: ${msg.content}`
        )
        .join("\n");
    }

    const prompt = `You are a helpful AI tutor. You have access to the following note content to help answer questions and provide explanations. Be educational, patient, and encouraging.

Note Content:
${noteContent}

${conversationText ? `Previous Conversation:\n${conversationText}\n` : ""}

Current Student Question: ${userMessage}

Instructions:
- Use the note content as your primary reference
- Provide clear, educational explanations
- Be encouraging and supportive
- If the question is not related to the note content, politely guide back to the topic
- Keep responses concise but thorough
- Use examples when helpful`;

    const aiResponse = await callGemini(prompt, {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topK: 40,
    });

    return {
      success: true,
      response: aiResponse,
      remainingRequests: usageCheck.remainingRequests,
    };
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
