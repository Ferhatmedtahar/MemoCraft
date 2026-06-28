"use server";

import { createClientForServer } from "@/utils/supabase/server";

export interface AIUsageResult {
  success: boolean;
  canUseAI: boolean;
  remainingRequests: number;
  message: string;
}

export async function checkAndUpdateAIUsage(): Promise<AIUsageResult> {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return {
        success: false,
        message: "User not authenticated",
        canUseAI: false,
        remainingRequests: 0,
      };
    }

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
        remainingRequests: 0,
      };
    }

    const now = new Date();
    const lastReset = userData?.last_ai_reset
      ? new Date(userData.last_ai_reset)
      : null;
    const currentUsage = userData?.ai_req || 0;

    const shouldReset =
      !lastReset || now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;

    if (shouldReset) {
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
          remainingRequests: 0,
        };
      }

      return {
        success: true,
        canUseAI: true,
        remainingRequests: 29,
        message: "Usage reset for new day",
      };
    }

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
        remainingRequests: 0,
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
      remainingRequests: 0,
    };
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
