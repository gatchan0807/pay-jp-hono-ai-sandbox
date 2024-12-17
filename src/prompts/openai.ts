import { ChatCompletionCreateParamsStreaming } from "openai/src/resources/index.js";

export function OpenAIPremiumPrompt() {
    
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;

    return [
        {
            role: 'system',
            content: `
            # Task: Generate Dinner Ideas

Create a list of 5 popular cooking names with descriptions for dinner ideas that can be easily made at home. The list MUST include the following:

1. One Seasonal Dish appropriate for the current date provided by the user (Easy-to-make World Cuisine dish).
2. Three Easy-to-make World Cuisine dish (suitable for Japanese home cooking).
3. One Common Japanese Home Dishes.

Use the following Markdown format for each item. Output should be a valid Markdown list. Each list element MUST have a name and a description. The description MUST be written in Japanese and explain the ingredients, cooking method, and taste characteristics, taking into account the dish's origin country. Please prioritize introducing seasonal ingredients and dishes that can be easily purchased at supermarkets.

# Hints for Cuisine Categories

*   Easy-to-make World Cuisine: Examples include Pasta, Curry, Tacos, etc.

## Output format

- 料理名: **(Display as is)**
  - (Provide a clear description in Japanese, explaining ingredients, cooking method, and taste characteristics. Use line breaks for better readability. Please mention the dish's origin. If the dish is seasonal, explicitly mention it is a seasonal dish and why it is popular during this time. Suggest readily available seasonal ingredients if applicable.)

## Example of items

- 料理名: **オムライス**
  - 鶏肉と玉ねぎなどの具材を炒めたチキンライスを、薄焼き卵で包んだ日本の洋食です。ふわふわの卵とケチャップの甘酸っぱさが特徴です。
- 料理名: **ビビンバ**
  - ご飯の上にナムルや肉、卵などの具材を彩りよく盛り付け、コチュジャンを混ぜて食べる韓国料理です。様々な食感と辛さが楽しめます。
- 料理名: **回鍋肉**
  - 豚肉とキャベツなどの野菜を炒め、甘辛い味噌で味付けた中華料理です。ご飯によく合います。
- 料理名: **ハンバーグ**
  - 牛肉や豚肉のひき肉にパン粉や玉ねぎなどを混ぜて焼いたアメリカ料理です。ジューシーな肉の旨味が特徴です。
- 料理名: **クレープ**
  - 薄く焼いた生地に、ジャムやチョコレート、果物などを包んだフランスの軽食です。甘くてもちもちした食感が楽しめます。

Generate 5 unique dinner ideas in total.

## User Input

Current date: {today date 例: 2023年10月27日}
`
        },
        {
            role: 'user',
            content: `${formattedDate}`
        }
    ] as ChatCompletionCreateParamsStreaming['messages'];
}