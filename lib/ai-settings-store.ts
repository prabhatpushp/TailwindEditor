"use client";

import { create } from "zustand";

// =============================================================================
// Encryption Helpers — AES-GCM via Web Crypto API
// =============================================================================
// The API key is encrypted before storing in localStorage using a
// device-derived key. This prevents casual inspection of the stored value.
// Note: This is not Fort Knox security — any JS running on the page could
// theoretically access the decrypted key. But it's the standard practice
// for BYOK client-side apps (used by TypingMind, OpenRouter, etc.)
// =============================================================================

const STORAGE_PREFIX = "tailwindeditor_";
const KEY_STORAGE = `${STORAGE_PREFIX}api_key_encrypted`;
const SETTINGS_STORAGE = `${STORAGE_PREFIX}ai_settings`;
const CRYPTO_SALT = "tailwindeditor-byok-v1";

async function deriveEncryptionKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(CRYPTO_SALT + navigator.userAgent.slice(0, 32)),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(CRYPTO_SALT),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptApiKey(apiKey: string): Promise<string> {
    try {
        const key = await deriveEncryptionKey();
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encoder.encode(apiKey)
        );
        // Combine IV + encrypted data into a single base64 string
        const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        return btoa(String.fromCharCode(...combined));
    } catch {
        // Fallback: base64 encode (for environments where crypto.subtle is unavailable)
        return btoa(apiKey);
    }
}

async function decryptApiKey(encryptedData: string): Promise<string> {
    try {
        const key = await deriveEncryptionKey();
        const combined = new Uint8Array(
            atob(encryptedData)
                .split("")
                .map((c) => c.charCodeAt(0))
        );
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            data
        );
        return new TextDecoder().decode(decrypted);
    } catch {
        // Fallback: try base64 decode
        try {
            return atob(encryptedData);
        } catch {
            return "";
        }
    }
}

// =============================================================================
// Types
// =============================================================================

export interface AISettings {
    systemPrompt: string;
    temperature: number;
    maxOutputTokens: number;
    model: string;
    topP: number;
    topK: number;
}

export interface AISettingsState extends AISettings {
    apiKey: string;
    isKeyLoaded: boolean;
    isSettingsDialogOpen: boolean;

    // Actions
    setApiKey: (key: string) => Promise<void>;
    removeApiKey: () => void;
    hasApiKey: () => boolean;
    loadApiKey: () => Promise<void>;

    updateSettings: (settings: Partial<AISettings>) => void;
    resetSettings: () => void;

    openSettingsDialog: () => void;
    closeSettingsDialog: () => void;
}

// =============================================================================
// Defaults
// =============================================================================

export const DEFAULT_SETTINGS: AISettings = {
    systemPrompt: `You are a helpful AI assistant for a visual Tailwind CSS editor. Use tailwind css V4 using <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script> in head tag.
When the user asks you to build or modify UI, respond ONLY with the complete HTML code.
Do NOT include any explanation, markdown formatting, or code fences.
Your response should be raw HTML that can be directly rendered in a browser.
Use Tailwind CSS classes for styling.
Provide clear, well-commented code.
Offer accessible, modern design suggestions.`,
    temperature: 1,
    maxOutputTokens: 65536,
    model: "gemini-3.1-flash-lite",
    topP: 0.95,
    topK: 40,
};

// =============================================================================
// Zustand Store
// =============================================================================

function loadSettingsFromStorage(): Partial<AISettings> {
    if (typeof window === "undefined") return {};
    try {
        const stored = localStorage.getItem(SETTINGS_STORAGE);
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return {};
}

function saveSettingsToStorage(settings: AISettings) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(settings));
    } catch { /* ignore */ }
}

export const useAISettingsStore = create<AISettingsState>((set, get) => ({
    // Initial state
    ...DEFAULT_SETTINGS,
    ...loadSettingsFromStorage(),
    apiKey: "",
    isKeyLoaded: false,
    isSettingsDialogOpen: false,

    // API Key management (encrypted in localStorage)
    setApiKey: async (key: string) => {
        if (key.trim()) {
            const encrypted = await encryptApiKey(key.trim());
            localStorage.setItem(KEY_STORAGE, encrypted);
        } else {
            localStorage.removeItem(KEY_STORAGE);
        }
        set({ apiKey: key.trim() });
    },

    removeApiKey: () => {
        localStorage.removeItem(KEY_STORAGE);
        set({ apiKey: "" });
    },

    hasApiKey: () => get().apiKey.length > 0,

    loadApiKey: async () => {
        if (typeof window === "undefined") return;
        const encrypted = localStorage.getItem(KEY_STORAGE);
        if (encrypted) {
            const decrypted = await decryptApiKey(encrypted);
            set({ apiKey: decrypted, isKeyLoaded: true });
        } else {
            set({ isKeyLoaded: true });
        }
    },

    // Settings management
    updateSettings: (partial: Partial<AISettings>) => {
        const current = get();
        const updated = {
            systemPrompt: partial.systemPrompt ?? current.systemPrompt,
            temperature: partial.temperature ?? current.temperature,
            maxOutputTokens: partial.maxOutputTokens ?? current.maxOutputTokens,
            model: partial.model ?? current.model,
            topP: partial.topP ?? current.topP,
            topK: partial.topK ?? current.topK,
        };
        saveSettingsToStorage(updated);
        set(updated);
    },

    resetSettings: () => {
        saveSettingsToStorage(DEFAULT_SETTINGS);
        set({ ...DEFAULT_SETTINGS });
    },

    // Dialog
    openSettingsDialog: () => set({ isSettingsDialogOpen: true }),
    closeSettingsDialog: () => set({ isSettingsDialogOpen: false }),
}));
