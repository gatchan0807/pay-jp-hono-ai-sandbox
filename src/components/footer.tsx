export function Footer() {
    return (
        <footer class="pl-8 py-4 w-full bg-slate-100">
            <ul class="list-disc pl-4 flex flex-col gap-1">
                <li>
                    <a href="/" class="underline text-blue-600 hover:text-blue-500">TOP</a>
                </li>
                <li>
                    <a href="/ai/limited" class="underline text-blue-600 hover:text-blue-500">機能限定版AI</a>
                </li>
                <li>
                    <a href="/ai/premium" class="underline text-blue-600 hover:text-blue-500">プレミアム版AI</a>
                </li>
            </ul>
        </footer>
    )
}