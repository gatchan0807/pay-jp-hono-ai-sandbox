export function Container({ children, gap = 0 }: { gap?: number, children?: any }) {
    return (
        <div class={`container mx-auto w-10/12 mt-4 flex flex-col gap-${gap}`}>
            {children}
        </div>
    )
}

export function AttentionBox({ type, children }: { type: "info" | "warn" | "error" | "success", children?: any }) {
    return (
        <div class={`p-4 my-2 rounded ${type === "info" ? "bg-blue-100 text-blue-600" : type === "warn" ? "bg-yellow-100 text-yellow-600" : type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {children}
        </div>
    )
}