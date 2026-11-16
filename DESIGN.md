# Design Document: Country Search

## 1. How Old Requests Are Cancelled
When the user types fast (for example, "sp" then "spain"), the server might answer "sp" slower than "spain". If the first request is not stopped, the old result ("sp") can arrive later and overwrite the new result ("spain").

**Why the app uses `AbortController` and not a flag:**
The application uses `AbortController` because it truly stops the network request. If a flag is used (like `isLatest = true`), the browser still downloads the old data in the background. This wastes network data and memory. 

In the code (`src/app/appController.ts`), `controller.abort()` is called immediately on every input change. This happens *before* the debounce timer. This guarantees that the old request is completely dead, and a race condition cannot happen.

## 2. Why the App Uses a 350ms Debounce Delay
A delay of **350 milliseconds** was chosen.
- **If the delay is removed:** The app will send a request for every single letter the user types. This will flood the server and use too much network data. 
- **If the delay is too large (e.g., 1000ms):** The app will feel slow. The user will think the app is broken because it takes too long to show results.
- **350ms:** This is a good balance. It waits for the user to finish typing a word, but it still feels like a fast "live search".

## 3. Time Complexity (Big O)
- **`mapCountryResponse`:** O(L + C), where L is the number of languages and C is the number of currencies. The function must loop through languages and currencies to get their names. Usually, L and C are very small (1 to 3), so this is very fast.
- **Cache & Deduplication (`src/api/cache.ts`):** O(1). A `Map` (a dictionary) is used to save results and active requests. Looking up a word in a `Map` is O(1) — it takes the same time, no matter how many items are in the cache.

## 4. Clean Code Principles
- **Single Responsibility:** Each file does only one job. 
  - `searchCountries.ts` only talks to the API.
  - `mapCountryResponse.ts` only changes data shape.
  - `appController.ts` only manages UI state and cancellation.
- **Separation of Concerns:** The logic files do not touch the HTML. All HTML changes are inside `src/main.ts`. This makes the logic easy to test without a browser.
- **Pure Functions:** Functions like `mapCountryResponse` and `classifyError` take input and return output. They do not change (mutate) data outside the function.
- **Safety (No XSS):** A rule was added in `eslint.config.js` to block `innerHTML`. In `src/main.ts`, only `document.createElement` and `textContent` are used. This protects the app from Cross-Site Scripting (XSS) attacks.