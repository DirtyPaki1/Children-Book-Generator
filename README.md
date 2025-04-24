# Children Book AI Generator

This app generates a custom children book for your child.

<img src="app-demo.gif" alt="app demo" width=600>

This app is built by The Codebender [𝕏](https://twitter.com/ZaurbekStark)/[YouTube](https://www.youtube.com/@thelastcodebender)

## Tech stack

- Next.js
- OpenAI GPT4 and Dall-E 3 for the AI
- Upstash for the rate-limiting
- Clerk for auth
- Pinecone for the vector db

## Getting Started

First, duplicate the `.env.example` file into a new file named `.env`.
Update the values there. Create accounts on OpenAI, Upstash, Clerk, and Pinecone, to get the API keys you need.

The first time you are running this project, you will need to install the dependencies. Run this command in your terminal:

```bash
yarn
```

To start the app, run:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
