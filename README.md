# Scope & Sum

**Quotes with the numbers checked.**

Scope & Sum helps small businesses prepare clear customer quotations and catch mistakes before they send them.

A business keeps a simple catalogue of services and prices, enters a customer's request, and gets an itemised quotation. SERV Reasoning powers the drafting step. Reppo independently reviews the result against the original request, catalogue and quotation rules.

## The problem

A quotation can look professional and still contain the wrong quantity, price, total, omitted work or an unsupported promise. Small businesses often have to check every line manually.

## The product

1. **Set up the business** — add its name, contact details, currency and services or products with prices.
2. **Describe the job** — enter the customer's details and what they asked for.
3. **Draft the quotation** — SERV Reasoning turns the request and catalogue into a structured, itemised quote.
4. **Check the quotation** — deterministic checks verify arithmetic and catalogue prices. Reppo independently evaluates whether the quote covers the request and follows the supplied constraints.
5. **Review and export** — show flagged issues, allow edits, then export the approved quotation as a PDF.

## What makes the review useful

Scope & Sum does not ask the same model that wrote the quote to grade itself. It sends the quotation and its source information to Reppo's Evaluation API for an independent verdict. A quote that needs changes stays in review until the business fixes it.

## Hackathon track

OpenServ SERV Hackathon 02 — **Reppo track**.

- **SERV Reasoning:** structured quotation drafting.
- **Reppo Evaluation API:** independent review and a documented verdict.

## Planned MVP

- Business profile and editable price catalogue
- Customer request form
- Structured quotation generation
- Price, quantity and total checks
- Reppo evaluation with critique and decision
- Editable review state
- PDF export

## Development

The app will keep API credentials on the server. Configure the required environment variables locally and in the deployment platform; never commit secrets.

