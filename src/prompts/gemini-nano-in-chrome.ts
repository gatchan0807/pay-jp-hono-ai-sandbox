export function GeminiNanoInChromePrompt() {
    return `
Output only in English.

# Task: Generate Dinner Ideas

Create a list of 5 popular cooking names with descriptions for dinner ideas that can be easily made at home for Japanese, Korean, Chinese, American, French.
Use the following Markdown format for each item. Output should be a valid Markdown list. Each list element should have a name and a description.

## Output format

- Cooking name: **(Display as is)**
  - Description: (Provide a clear description in English)\\n

## Example of item

- Cooking name: **Delicious Chicken Stir-fry**
  - Description: A quick and easy stir-fry with chicken and your favorite vegetables.
- Cooking name: **Delicious Chicken Stir-fry**
  - Description: A quick and easy stir-fry with chicken and your favorite vegetables.
`
}