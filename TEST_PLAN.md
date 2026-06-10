# Test Plan

Use this checklist to manually test the Chrome extension.

## Setup

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder:

   ```text
   /Users/ajithc/WorkSpace/translation-extension-chrome
   ```

6. Confirm **Translation Extension** appears in the extensions list.

## Smoke test

1. Click the Chrome extensions puzzle icon.
2. Open **Translation Extension**.
3. Enter:

   ```text
   Good morning, how are you?
   ```

4. Click **Translate**.
5. Confirm the popup shows translations for:
   - French
   - Telugu
   - Spanish

## Copy test

1. Complete the smoke test.
2. Click **Copy** beside the French result.
3. Paste into a text field.
4. Confirm the pasted text matches the French translation.
5. Repeat for Telugu and Spanish.

## Persistence test

1. Complete the smoke test.
2. Close the extension popup.
3. Open **Translation Extension** again.
4. Confirm the previous English input and translations are still visible.

## Clear test

1. Complete the smoke test.
2. Click **Clear**.
3. Confirm the input is empty.
4. Confirm all three result sections show `No translation yet`.
5. Close and reopen the popup.
6. Confirm the cleared state remains.

## Validation test

1. Open the extension popup.
2. Leave the input empty.
3. Click **Translate**.
4. Confirm the popup asks for English text and does not call translation.

## Network/error test

1. Turn off network access or block `https://api.mymemory.translated.net`.
2. Enter English text.
3. Click **Translate**.
4. Confirm the popup shows an error message.
5. Restore network access and confirm translation works again.

## Repository checks

Run these from the project folder:

```bash
python3 -m json.tool manifest.json
node --check popup.js
git status --short --branch
```

Expected result:

- `manifest.json` parses successfully
- `popup.js` has no syntax errors
- Git status is clean after committed changes are pushed
