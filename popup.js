const LANGUAGES = [
  { key: "french", label: "French", code: "fr" },
  { key: "telugu", label: "Telugu", code: "te" },
  { key: "spanish", label: "Spanish", code: "es" }
];

const STORAGE_KEY = "lastTranslation";

const form = document.querySelector("#translate-form");
const sourceText = document.querySelector("#source-text");
const translateButton = document.querySelector("#translate-button");
const clearButton = document.querySelector("#clear-button");
const statusMessage = document.querySelector("#status");
const copyButtons = document.querySelectorAll(".copy-button");

const resultElements = LANGUAGES.reduce((elements, language) => {
  elements[language.key] = document.querySelector(`#${language.key}`);
  return elements;
}, {});

let latestResults = {};

restoreLastTranslation();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = sourceText.value.trim();
  if (!text) {
    setStatus("Enter English text to translate.", true);
    return;
  }

  setLoading(true);
  setStatus("Translating...");

  try {
    const translations = await translateAll(text);
    latestResults = translations;
    renderTranslations(translations);
    await saveLastTranslation(text, translations);
    setStatus("Translation complete.");
  } catch (error) {
    console.error(error);
    setStatus("Translation failed. Check your connection and try again.", true);
  } finally {
    setLoading(false);
  }
});

clearButton.addEventListener("click", async () => {
  sourceText.value = "";
  latestResults = {};
  renderTranslations({});
  setStatus("");
  await chrome.storage.local.remove(STORAGE_KEY);
  sourceText.focus();
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const key = button.dataset.copy;
    const value = latestResults[key];

    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    const originalText = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1200);
  });
});

async function translateAll(text) {
  const entries = await Promise.all(
    LANGUAGES.map(async (language) => {
      const translatedText = await translateText(text, language.code);
      return [language.key, translatedText];
    })
  );

  return Object.fromEntries(entries);
}

async function translateText(text, targetLanguage) {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `en|${targetLanguage}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation API returned ${response.status}`);
  }

  const payload = await response.json();
  const translatedText = payload?.responseData?.translatedText;

  if (!translatedText) {
    throw new Error("Translation API returned no translated text");
  }

  return translatedText;
}

function renderTranslations(translations) {
  LANGUAGES.forEach((language) => {
    const element = resultElements[language.key];
    const value = translations[language.key];

    element.textContent = value || "No translation yet";
    element.classList.toggle("empty", !value);

    const copyButton = document.querySelector(`[data-copy="${language.key}"]`);
    copyButton.disabled = !value;
  });
}

function setLoading(isLoading) {
  translateButton.disabled = isLoading;
  translateButton.textContent = isLoading ? "Translating..." : "Translate";
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

async function saveLastTranslation(text, translations) {
  await chrome.storage.local.set({
    [STORAGE_KEY]: {
      text,
      translations
    }
  });
}

async function restoreLastTranslation() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const lastTranslation = stored[STORAGE_KEY];

  if (!lastTranslation) {
    return;
  }

  sourceText.value = lastTranslation.text || "";
  latestResults = lastTranslation.translations || {};
  renderTranslations(latestResults);
}
