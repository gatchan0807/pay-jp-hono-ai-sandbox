import { useEffect, useState } from "hono/jsx"

// @see: https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.nszgbi9928bg
export interface AICapabilities {
    readonly available: "readily" | "after-download" | "no"
    readonly defaultTopK?: number
    readonly maxTopK?: number
    readonly defaultTemperature?: number
}

export interface AI {
    languageModel: AILanguageModelFactory
}

export interface AILanguageModelFactory {
    capabilities: () => Promise<AICapabilities | null>
    create: (options?: AILanguageModelOptions) => AILanguageModel
}

export interface AILanguageModel {
    prompt: (input: string, options?: Record<string, never>) => Promise<string>
    promptStreaming: (input: string, options?: Record<string, never>) => ReadableStream<string>
    countPromptTokens: (input: string, options?: Record<string, never>) => Promise<number>
    readonly maxTokens: number
    readonly tokensSoFar: number
    readonly tokensLeft: number
    readonly topK: number
    readonly temperature: number
    clone: () => Promise<AILanguageModel>
    destroy: () => undefined;
}

export interface AILanguageModelOptions {
    signal: boolean
    systemPrompt: string
    initialPrompts: AILanguageModelPrompt
    topK: number
    temperature?: number
}

export interface AILanguageModelPrompt {
    role: "system" | "user" | "assistant"
    content: string
}

// 以下、実際のコード
export function useLanguageModel() {
    const [ai, setAi] = useState<AILanguageModelFactory | null>(null)
    const [available, setAvailable] = useState<string | null>(null)
    useEffect(() => {
        (async () => {
            // @ts-expect-error - AI object is usable only in the already setting completed Chrome
            if (typeof window === "undefined" || typeof window.ai === "undefined") {
                return
            }
            // 使えるようににしたいよ〜というリクエストを投げる部分
            // @see: https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.d0qnxe57ficp
            
            // @ts-expect-error - AI object is usable only in the already setting completed Chrome
            setAvailable((await window.ai.languageModel.capabilities()).available);
            // @ts-expect-error - AI object is usable only in the already setting completed Chrome
            await window.ai.languageModel.create();
            
            // @ts-expect-error - AI object is usable only in the already setting completed Chrome
            setAi(window.ai.languageModel);
        })()
    }, [ai, available])
    
    return ai
}