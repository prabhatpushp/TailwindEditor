"use client";

import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import type { AISettings } from "./ai-settings-store";

// =============================================================================
// Types
// =============================================================================

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt?: Date;
}

export type StreamStatus = "ready" | "submitted" | "streaming" | "error";

// =============================================================================
// Error Classification (client-side equivalent of route.ts ErrorClassifier)
// =============================================================================

export function classifyError(error: unknown): string {
    const msg = error instanceof Error ? error.message : String(error);
    const lower = msg.toLowerCase();

    if (lower.includes("api key") || lower.includes("api_key_invalid") || lower.includes("unauthorized") || lower.includes("401")) {
        return "Invalid API key. Please check your key in Settings.";
    }

    if (lower.includes("quota exceeded") || lower.includes("quota_exceeded") || lower.includes("resource_exhausted")) {
        const match = msg.match(/retry in (\d+\.?\d*)s/i);
        if (match) return `Quota exceeded. Please retry in ${Math.ceil(parseFloat(match[1]))} seconds.`;
        return "API quota exceeded. Please try again later or check your billing.";
    }

    if (lower.includes("rate limit") || lower.includes("429") || lower.includes("too many requests")) {
        const match = msg.match(/retry in (\d+\.?\d*)s/i);
        if (match) return `Rate limited. Please retry in ${Math.ceil(parseFloat(match[1]))} seconds.`;
        return "Rate limit exceeded. Please slow down.";
    }

    if (lower.includes("network") || lower.includes("fetch") || lower.includes("timeout") || lower.includes("failed to fetch")) {
        return "Network error. Please check your connection.";
    }

    if (lower.includes("blocked") || lower.includes("safety")) {
        return "Response was blocked by safety filters. Please rephrase your request.";
    }

    if (lower.includes("failed to parse stream")) {
        return "Failed to parse API response. Please check if your AI model name is valid and that output tokens are within limits.";
    }

    return msg.length > 200 ? msg.slice(0, 200) + "…" : msg;
}

// =============================================================================
// Client-Side Gemini Streaming
// =============================================================================

export async function* streamGeminiChat(
    apiKey: string,
    messages: ChatMessage[],
    settings: AISettings,
    signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: settings.model,
        systemInstruction: settings.systemPrompt,
        generationConfig: {
            temperature: settings.temperature,
            maxOutputTokens: Math.min(settings.maxOutputTokens, 8192),
            topP: settings.topP,
            topK: settings.topK,
        },
    });

    // Convert our messages to Gemini format and ensure alternating roles
    const history: Content[] = [];
    const rawHistory = messages.slice(0, -1).filter((msg) => msg.content && msg.content.trim().length > 0);

    for (const msg of rawHistory) {
        const role = msg.role === "assistant" ? "model" : "user";
        // Prevent consecutive same roles
        if (history.length === 0 && role === "model") continue; // History must start with user
        if (history.length > 0 && history[history.length - 1].role === role) continue;

        history.push({
            role,
            parts: [{ text: msg.content }],
        });
    }

    // History must end with model to allow a new user message
    if (history.length > 0 && history[history.length - 1].role === "user") {
        history.pop();
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
        throw new Error("Last message must be from the user");
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
        if (signal?.aborted) return;
        const text = chunk.text();
        if (text) yield text;
    }
}
