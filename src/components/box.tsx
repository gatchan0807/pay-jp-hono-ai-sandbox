export function AttentionBox({ type, children }: { type: "info" | "warn" | "error" | "sub" | "success", children?: any }) {
    return (
        <div class={`p-4 rounded ${type === "info" ?
            "bg-blue-100 text-blue-600" : type === "warn" ?
                "bg-yellow-100 text-yellow-600" : type === "error" ?
                    "bg-red-100 text-red-600" : type === "sub" ?
                    "bg-slate-100 text-slate-600" :
                    "bg-green-100 text-green-600"
            }`}>
            {children}
        </div>
    )
}