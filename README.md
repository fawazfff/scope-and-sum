# Scope & Sum

**Clear quotations. Catalogue-controlled pricing. Independent review.**

Scope & Sum helps service businesses turn a customer's request into a structured, itemised quotation. It uses **OpenServ SERV Reasoning** to analyse the brief and draft the quote, then uses **Reppo** for an independent evaluation before the business exports the final document.

**Live website:** https://scope-and-sum.vercel.app  
**5-minute demo video:** https://x.com/fawaztechyt_/status/2122084210580320681  
**Source code:** https://github.com/fawazfff/scope-and-sum  
**Built for:** OpenServ SERV Hackathon 02 · Reppo track

## Start here

Want to understand the project quickly?

1. **[Open the live website](https://scope-and-sum.vercel.app)** to explore the landing page and quotation workspace. No local setup is needed.
2. **[Watch the 5-minute demo](https://x.com/fawaztechyt_/status/2122084210580320681)** to see the workflow in action, including SERV quotation generation and Reppo evaluation.
3. **Read the sections below** for the problem, product flow, implementation details and setup instructions.

The live workspace uses browser local storage for the business profile and catalogue. The AI generation and evaluation features call server-side Vercel API routes, so the deployed website is the easiest way to explore the product.

## The problem

Preparing a quotation is more than adding up prices. A business needs to understand what the customer is asking for, decide which services apply, describe the deliverables, calculate the cost and check that nothing important has been missed.

Manual quoting takes time. AI-generated quotes introduce another risk: a model may suggest services or prices that the business never approved.

Scope & Sum addresses this by grounding generated quotations in the business's own service catalogue and keeping the business owner responsible for the final review.

## What SERV and Reppo do

### 1. SERV Reasoning: Builds the quotation

**Creates**

SERV acts like an assistant for the business.

It:

- Reads the customer's request.
- Understands what work the customer needs.
- Matches the request to services in the business catalogue.
- Organises the work into quotation line items.
- Helps create a quotation draft.

**Important:** SERV does not decide the prices. Scope & Sum checks the suggested services against the saved catalogue and uses the business's approved prices.

### 2. Reppo: Independently reviews the quotation

**Evaluates**

Reppo acts like an independent judge.

It:

- Receives the original customer request.
- Reviews the business rules and service catalogue.
- Examines the generated quotation.
- Checks for missing scope, unclear descriptions, pricing inconsistencies and unsupported assumptions.
- Returns an independent evaluation.

### How they work together

1. **Customer request**  
   What the customer wants.

2. **SERV Reasoning**  
   Understands the request and builds the quotation.

3. **Scope & Sum price validation**  
   Checks that services and prices follow the saved catalogue.

4. **Reppo**  
   Independently evaluates the quotation.

5. **Reviewed quotation**  
   The business owner checks the result and exports the PDF.

## How it works

### 1. Set up the business

The business owner enters the business name, contact information, payment terms and service catalogue. Each catalogue entry has a service name, description and approved USD price.

The catalogue is the pricing source of truth. The current MVP stores the business profile and catalogue in the browser's local storage.

### 2. Describe the customer's request

The user enters the customer's details and describes the work requested, including relevant requirements and expectations.

### 3. SERV analyses the request and drafts the quotation

When the user selects **Analyse request & build quote**, the app sends the customer brief, business context and approved catalogue to the server-side generation endpoint.

OpenServ SERV Reasoning, using the configured language model, is instructed to:

- Understand the customer's requested work.
- Match relevant work to exact service names in the approved catalogue.
- Describe the proposed scope and deliverables.
- Suggest quantities where the request provides enough information.
- Identify work that needs manual scoping instead of inventing a catalogue service.
- Return structured quotation data for the application to process.

SERV does not set the final prices. The server matches every generated line to the catalogue and inserts the saved USD unit price. A line that cannot be matched to the approved catalogue is rejected rather than silently priced.

### 4. Reppo independently evaluates the quotation

After the business reviews and edits the draft, the app submits the original customer request, catalogue, business rules and proposed quotation to the Reppo Evaluation API.

The evaluation is intended to assess:

- Whether the quote covers the customer's request.
- Whether deliverables and scope are clear.
- Whether important gaps, assumptions or exclusions are identified.
- Whether quotation services and unit prices match the approved catalogue.
- Whether quantities, line totals and overall totals are consistent.

Reppo runs its independent evaluation process. Its status may remain queued or processing while evaluators work. Scope & Sum polls the evaluation status and displays the returned result when available.

Reppo provides an assessment, not legal, tax or accounting certification. The business owner makes the final decision.

### 5. Review and export

The business owner can review the quotation details, edit the draft and use the document preview to print or save the quotation as a PDF.

## What is implemented

- Business profile and editable service catalogue.
- Customer request and contact details.
- SERV-powered structured quotation drafting.
- Catalogue matching and server-side price enforcement.
- Quantity and quotation total calculations.
- Reppo evaluation submission and status retrieval.
- Automatic evaluation status polling in the workspace.
- Quotation editing and print-to-PDF export.
- USD quotation display.
- Help content explaining the workflow.

## Technology

- **React 18** for the user interface.
- **Vite 6** for development and production builds.
- **Vercel Functions** for server-side API routes.
- **OpenServ SERV Reasoning API** for quotation generation.
- **Reppo Evaluation API** for independent quotation review.
- **Lucide React** for interface icons.

## Environment variables

Configure these in the Vercel project settings. Keep all credentials server-side and never commit them to the repository.

| Variable | Purpose |
| --- | --- |
| `SERV_REASONING_API_KEY` | Authenticates requests to OpenServ SERV Reasoning. |
| `SERV_REASONING_MODEL` | Optional model override. If unset, the server discovers an available model and falls back to `claude-haiku-4.5`. |
| `REPPO_API_KEY` | Authenticates evaluation submissions and status requests to Reppo. |

After changing production environment variables, redeploy the application for the changes to take effect.

## Run locally

Requirements: Node.js 22 or a compatible recent Node.js release, and npm.

```bash
git clone https://github.com/fawazfff/scope-and-sum.git
cd scope-and-sum
npm install
npm run dev
```

To create a production build:

```bash
npm run build
npm run preview
```

The AI features require the environment variables above to be configured in the serverless runtime. Do not expose API keys in frontend code or commit a `.env` file.

## Project structure

```text
.
├── api/
│   ├── generate.js       # SERV quotation generation and catalogue price enforcement
│   └── evaluations.js    # Reppo evaluation submission and status retrieval
├── public/
│   └── favicon.svg       # Scope & Sum browser icon
├── src/
│   ├── App.jsx           # Landing page, workspace and quotation workflow
│   ├── main.jsx          # React entry point and render error boundary
│   └── styles.css        # Application styles
├── index.html
└── package.json
```

## Current MVP boundaries

- Business profile and catalogue data are stored in the current browser, not a shared cloud database.
- The customer request is entered directly in the workspace.
- A public business storefront, customer-facing share link, online acceptance, customer messaging and file uploads are not part of this MVP.
- PDF output uses the browser's print dialog. Choose **Save as PDF**.
- Reppo evaluation duration depends on Reppo's evaluator process and queue.
- AI-generated content must be checked by the business owner before it is sent to a customer.

## Project links

- **Live website:** https://scope-and-sum.vercel.app
- **Demo video on X:** https://x.com/fawaztechyt_/status/2122084210580320681
- **GitHub repository:** https://github.com/fawazfff/scope-and-sum
- **Builder:** [@fawaztechyt_](https://x.com/fawaztechyt_)

## Hackathon

Built for **OpenServ SERV Hackathon 02**, on the **Reppo track**.

The project brings together SERV-powered quotation drafting and Reppo's independent evaluation in one practical business workflow. The goal is straightforward: help a business prepare a useful quotation while keeping its approved catalogue prices under its control.

---

Made by [@fawazfff](https://github.com/fawazfff).
