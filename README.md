# One Person Company — 3D AI Office

A 3D office for Brandon Lee's four AI agents, built with Three.js.
Click an agent at its desk to talk to it, generate with it, and hand
its output to another agent.

Live site: https://opc-3d-office.vercel.app

## The four agents

- **Offer Architect** — builds offers with Alex Hormozi's $100M Offers
  framework: Value Equation, problems to solutions, trim and stack,
  scarcity, urgency, bonuses, and guarantees.
- **Prospector** — finds prospects, researches them, qualifies them,
  and drafts personalised outreach in your voice.
- **Money Agent** — reads invoices, categorises money, gives a Monday
  snapshot, and drafts chase emails. Human approval is required before
  anything is sent.
- **Content Machine** — turns one voice note or one idea into a week
  of content: posts, carousels, emails, scripts, and video ideas.

## How it works

- `index.html` is the whole office: Three.js scene, chat panel,
  saved outputs board, and handoffs between agents.
- `api/chat.js` is a Vercel serverless function. It holds each agent's
  system prompt, calls OpenRouter, and returns the reply.
- The browser never sees an API key. It only calls `/api/chat`.

## Setup (Vercel)

1. Deploy this folder to Vercel.
2. In Vercel, Project Settings, Environment Variables, add:
   `OPENROUTER_API_KEY` — your OpenRouter key, encrypted in Vercel.
3. Redeploy. The default model is `deepseek/deepseek-v4.1-flash`.

## Notes

- Saving and handoffs are stored in the browser for now, not in a
  shared server database.
- These are on-demand chat agents, not autonomous background agents.
  They do not send email, book calls, or move money on their own.
- Office behaviours (confetti on finish, jumping on finish, office
  dog, desk signs) were inspired by AgentSystemLabs/agent-office
  (MIT), adapted here in original code for this static site.
