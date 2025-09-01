"use server";

import { createClientForServer } from "@/utils/supabase/server";

export async function checkAndUpdateAIUsage() {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return {
        success: false,
        message: "User not authenticated",
        canUseAI: false,
      };
    }

    // Get user's current AI usage
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("ai_req, last_ai_reset")
      .eq("id", user.data.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return {
        success: false,
        message: "Failed to check usage",
        canUseAI: false,
      };
    }

    const now = new Date();
    const lastReset = userData?.last_ai_reset
      ? new Date(userData.last_ai_reset)
      : null;
    const currentUsage = userData?.ai_req || 0;

    // Check if 24 hours have passed since last reset
    const shouldReset =
      !lastReset || now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;

    if (shouldReset) {
      // Reset usage count
      const { error: resetError } = await supabase
        .from("users")
        .update({
          ai_req: 1,
          last_ai_reset: now.toISOString(),
        })
        .eq("id", user.data.user.id);

      if (resetError) {
        console.error("Error resetting usage:", resetError);
        return {
          success: false,
          message: "Failed to update usage",
          canUseAI: false,
        };
      }

      return {
        success: true,
        canUseAI: true,
        remainingRequests: 29,
        message: "Usage reset for new day",
      };
    }

    // Check if user has exceeded limit
    if (currentUsage >= 30) {
      const timeUntilReset =
        24 * 60 * 60 * 1000 - (now.getTime() - lastReset!.getTime());
      const hoursUntilReset = Math.ceil(timeUntilReset / (60 * 60 * 1000));

      return {
        success: true,
        canUseAI: false,
        remainingRequests: 0,
        message: `Daily limit reached. Resets in ${hoursUntilReset} hours.`,
      };
    }

    // Increment usage count
    const { error: updateError } = await supabase
      .from("users")
      .update({ ai_req: currentUsage + 1 })
      .eq("id", user.data.user.id);

    if (updateError) {
      console.error("Error updating usage:", updateError);
      return {
        success: false,
        message: "Failed to update usage",
        canUseAI: false,
      };
    }

    return {
      success: true,
      canUseAI: true,
      remainingRequests: 30 - (currentUsage + 1),
      message: "Request authorized",
    };
  } catch (error) {
    console.error("Error in checkAndUpdateAIUsage:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      canUseAI: false,
    };
  }
}

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

  // Check usage limit before making AI request
  const usageCheck = await checkAndUpdateAIUsage();
  if (!usageCheck.success || !usageCheck.canUseAI) {
    return {
      success: false,
      formattedContent: content,
      message: usageCheck.message,
      remainingRequests: usageCheck.remainingRequests || 0,
    };
  }

  const apiKey = process.env.GOOGLE_CLIENT_AI;
  if (!apiKey) {
    return {
      success: false,
      formattedContent: content,
      message: "AI service not available",
    };
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
      return {
        success: false,
        formattedContent: content,
        message: "Failed to get AI response",
        remainingRequests: usageCheck.remainingRequests,
      };
    }

    const data = await response.json();

    // Better error handling for the response structure
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      console.error("Unexpected API response structure:", data);
      return {
        success: false,
        formattedContent: content,
        message: "Invalid AI response",
        remainingRequests: usageCheck.remainingRequests,
      };
    }

    const formattedContent =
      data.candidates[0].content.parts[0]?.text || content;

    // Basic validation - if formatted content is much longer than original, something went wrong
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
    // Check rate limiting first
    const usageCheck = await checkAndUpdateAIUsage();
    if (!usageCheck.success || !usageCheck.canUseAI) {
      return {
        success: false,
        message: usageCheck.message,
        remainingRequests: usageCheck.remainingRequests || 0,
      };
    }

    const apiKey = process.env.GOOGLE_CLIENT_AI;
    if (!apiKey) {
      return { success: false, message: "AI service not available" };
    }

    // Build conversation context
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
            maxOutputTokens: 1024,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from AI API:", errorText);
      return { success: false, message: "Failed to get AI response" };
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      console.error("Unexpected API response structure:", data);
      return { success: false, message: "Invalid AI response" };
    }

    const aiResponse = data.candidates[0].content.parts[0]?.text || "";

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

export async function fetchNotes() {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return null;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchNotes:", error);
    return null;
  }
}

export async function fetchNoteById(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (error) {
      console.error("Error fetching note:", error);
      return { success: false, message: "Note not found" };
    }

    return { data, success: true };
  } catch (error) {
    console.error("Error in fetchNoteById:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function getUserAIUsage() {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("users")
      .select("ai_req, last_ai_reset")
      .eq("id", user.data.user.id)
      .single();

    if (error) {
      console.error("Error fetching usage:", error);
      return { success: false, message: "Failed to fetch usage data" };
    }

    const now = new Date();
    const lastReset = data?.last_ai_reset ? new Date(data.last_ai_reset) : null;
    const currentUsage = data?.ai_req || 0;

    // Check if 24 hours have passed since last reset
    const shouldReset =
      !lastReset || now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;

    if (shouldReset) {
      return {
        success: true,
        currentUsage: 0,
        remainingRequests: 30,
        resetTime: null,
      };
    }

    const timeUntilReset =
      24 * 60 * 60 * 1000 - (now.getTime() - lastReset!.getTime());

    return {
      success: true,
      currentUsage: Math.min(currentUsage, 30),
      remainingRequests: Math.max(0, 30 - currentUsage),
      resetTime: new Date(now.getTime() + timeUntilReset),
    };
  } catch (error) {
    console.error("Error in getUserAIUsage:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
