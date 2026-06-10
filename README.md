# Translation Extension for Chrome

A Chrome extension popup that translates English text into French, Telugu, and Spanish.

## Features

- Translate one English input into three languages at once
- Copy each translated result
- Remember the last input and translations with Chrome local storage
- Plain Manifest V3 extension with no build step

## Run locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder:

   ```text
   translation-extension-chrome
   ```

5. Click the extension icon and enter English text.

## Translation provider

The MVP uses the public MyMemory translation endpoint from the popup script. For production, route requests through your own backend and call a provider such as Google Cloud Translate, Azure Translator, DeepL, or OpenAI from the server. That keeps API keys out of the extension package.
