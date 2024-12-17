export function Footer() {
    return (
        <footer class="pl-8 py-4 w-full bg-slate-100">
            <p>ページ一覧</p>
            <ul >
                <li>
                    <a href="/" class="underline text-teal-600 hover:text-teal-500">TOP</a>
                </li>
                <li>
                    <a href="/ai/limited" class="underline text-teal-600 hover:text-teal-500">機能限定版AI</a>
                </li>
                <li>
                    <a href="/ai/premium" class="underline text-teal-600 hover:text-teal-500">プレミアム版AI</a>
                </li>
            </ul>
        </footer>
    )
}