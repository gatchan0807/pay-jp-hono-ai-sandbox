export function Header() {
    return (
        <header class="pl-8 py-4 w-full flex justify-between items-center border-b-2 border-blue-500">
            <h2 class="text-4xl font-bold text-blue-500"><a href="/">AI献立提案</a></h2>
            <ul class="flex flex-row gap-4 justify-end mr-4">
                <li class="">
                    <a href="/" class="underline text-blue-600 hover:text-blue-500">TOP</a>
                </li>
                <li class="">
                    <a href="/ai/limited" class="underline text-blue-600 hover:text-blue-500">機能限定版AI</a>
                </li>
                <li class="">
                    <a href="/ai/premium" class="underline text-blue-600 hover:text-blue-500">プレミアム版AI</a>
                </li>
            </ul>
        </header>
    )
}