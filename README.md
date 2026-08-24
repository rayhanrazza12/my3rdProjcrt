# AI Study Helper

A simple AI-powered web app that explains topics, creates summaries, and makes quizzes.

## Run it on your computer

1. Install [Node.js](https://nodejs.org/).
2. Open this folder in a terminal and run `npm install`.
3. Create a file named `.env` and add `OPENAI_API_KEY=your_key_here`.
4. Run `npm start`, then open `http://localhost:3000`.

The `.env` file is only for local use. The app never sends the API key to the browser.

## Deploy with GitHub and Railway

1. Create a GitHub repository and upload these files. Do **not** upload `.env`.
2. In Railway, choose **New Project** → **Deploy from GitHub Repo**, then select the repository.
3. In Railway's project variables, add `OPENAI_API_KEY` with your OpenAI API key.
4. Optional: add `OPENAI_MODEL` to select a model; without it, the app uses `gpt-5`.
5. Railway detects `npm start` automatically. When deployment finishes, open the generated domain.

## What you learned

- `public/` holds the website users see.
- `server.js` is the protected backend that contacts the AI.
- Environment variables keep secret keys out of GitHub and the browser.
