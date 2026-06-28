"use server";

import { callGemini } from "@/lib/gemini";
import { checkAndUpdateAIUsage, getUserAIUsage } from "@/lib/ai-usage";

export { checkAndUpdateAIUsage, getUserAIUsage };

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
      temperature: 0.4,
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
