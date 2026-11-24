# Company Brain

A runnable DTC intelligence demo built for Peter Caspari / BizzWerx AI. The fictional Ritual & Co. workspace demonstrates the path from commercial evidence to decisions and local task drafts.

## Run locally

Install Node.js 22.13 or newer, then run from this directory:

```sh
npm ci
npm start
```

Open http://localhost:3000. No credentials or dependencies are required for offline demo mode. `npm test` runs API and calculation tests in an isolated in-memory database.

## What works

- Executive dashboard with 7 / 14 / 28-day calculations and chart.
- Database-backed offline question answering for trading, inventory, creative and knowledge topics. Unsupported questions return the supported scope.
- Optional Claude Messages API tool loop. Claude reads allowlisted business functions over SQLite; it cannot run arbitrary SQL or execute external actions.
- Creative comparison, hooks, angles and fatigue signals.
- Stock-cover calculations and lead-time alerts.
- Searchable meeting, research and metric-definition records.
- Five on-demand deterministic agents, execution history and local task drafts.
- Downloadable founder reports.
- Responsive layout, explicit synthetic-data labels and planned integration inventory.

All records are synthetic, anchored to 24 November 2026. Trading data is separate from fixed creative totals and inventory snapshots. This is not an existing client's data or a claim of measured business results.

## Push to GitHub

Create an empty GitHub repository. From **this folder**, run:

```sh
git init
git add .
git commit -m "Build Company Brain demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/company-brain-demo.git
git push -u origin main
```

Replace the URL with your repository URL. `.env`, runtime data and dependencies are ignored. The project has no bundled credentials. Do not push the surrounding Upwork project or proposal material.

## Import and publish on Replit

1. Import the GitHub repository into a Replit app.
2. Confirm the runtime is Node.js **22.13 or newer** (`node --version`). The included `.replit` selects Node 22, starts `npm start` and maps port 3000 to port 80.
3. Run `npm ci`, then Run. The first start creates and seeds `data/brain.sqlite` automatically.
4. Publish as a server app / Autoscale deployment with `npm start` as the run command. There is no build step. Do not choose static hosting.
5. Test the published app with an inventory question and agent run.

This deliberately uses SQLite to make the demo portable. A deployed instance's local files are disposable: agent history and drafts may reset on restart, deployment or scale-out; instances do not share state. The deterministic seed makes this acceptable for a portfolio demo. Use managed PostgreSQL, migrations and account authentication before using real business information or expecting durable, shared state.

Configuration reference: https://docs.replit.com/features/project-setup/configuration

## Optional Claude mode

Copy `.env.example` to `.env` locally, or add these as Replit Secrets:

```text
ANTHROPIC_API_KEY=your-key
ANTHROPIC_MODEL=claude-sonnet-4-5
DEMO_ACCESS_TOKEN=a-long-random-private-token
```

Restart / redeploy after setting secrets. In Ask the brain, select **Use Claude** and enter the access token. The key stays on the server; the access token stays in the current page's memory. Use a model ID available to your Anthropic account. Requests consume your Anthropic quota. Without both server secrets the interface stays in offline mode. The server limits concurrent paid requests to two per instance and bounds tool steps and request size. It does not provide per-user billing quotas or production authentication. Keep the token private.

Claude uses the documented Messages API and read-only client tools: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

## Architecture and honest boundaries

Browser HTML/CSS/JavaScript → Node HTTP API → SQLite reporting / knowledge functions → optional Claude tool-use loop.

There is no frontend compilation or npm runtime dependency. The seed is in `database.js`; HTTP routes and tool orchestration are in `server.js`; UI assets are in `public/`.

No Shopify, Meta, Google, Klaviyo, Loop, Slack, ClickUp, video generation, crawling or MCP connection is active. Integration cards describe the proposed production layer. Agents are deterministic on-demand analyses, not scheduled autonomous workers. Reports download locally; task drafts never leave the application. Knowledge search is literal text filtering, not semantic RAG. SQLite is used instead of the proposed PostgreSQL stack to keep this first demonstration self-contained.

Before a real rollout: add managed PostgreSQL, scoped user accounts, source ingestion and reconciliation, durable job queues, connector credentials, permissions, tool approvals, audit trails, retrieval evaluation and external connector tests.

## Suggested Loom walkthrough (5–7 minutes)

1. Explain the synthetic brand and the business question: can we safely scale our winning creative?
2. Change trading periods and explain MER versus attributed creative ROAS.
3. Explore the stockout evidence from the overview.
4. Ask which creative angles work, then open Creative intelligence.
5. Draft a replenishment task; explain that a real ClickUp write would be a later approved integration.
6. Run Inventory sentinel, inspect its stored output and show the task draft under Agents.
7. Download the founder report and search the meeting decisions in Knowledge.
8. Explain the live Claude tool loop if configured, then distinguish the working demo from planned integrations.
