import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Plus,
  Printer,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

const initialItems = [
  { id: 1, description: "Brand identity direction", detail: "Concept, visual direction and logo suite", quantity: 1, price: 480000 },
  { id: 2, description: "Social launch templates", detail: "Six editable templates for social channels", quantity: 1, price: 160000 },
  { id: 3, description: "Packaging artwork", detail: "Two print-ready packaging layouts", quantity: 2, price: 62500 },
];

const today = new Date();
const expiry = new Date(today);
expiry.setDate(expiry.getDate() + 14);
const toDateInput = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

function money(value, currency) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function prettyDate(value) {
  if (!value) return "Not set";
  return new Date(value + "T12:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Field({ label, value, onChange, placeholder, type = "text", className = "", ...props }) {
  return (
    <label className={"field " + className}>
      <span className="field-label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
}

function App() {
  const [business, setBusiness] = useState({
    name: "Fieldnote Studio",
    email: "hello@fieldnote.studio",
    phone: "+234 801 234 5678",
    address: "18 Akin Adesola Street, Lagos",
  });
  const [client, setClient] = useState({
    name: "Aster & Co.",
    email: "finance@asterand.co",
    address: "Victoria Island, Lagos",
  });
  const [title, setTitle] = useState("Brand identity & launch");
  const [reference, setReference] = useState("FN-2026-014");
  const [currency, setCurrency] = useState("NGN");
  const [issuedAt, setIssuedAt] = useState(toDateInput(today));
  const [validUntil, setValidUntil] = useState(toDateInput(expiry));
  const [notes, setNotes] = useState("Thanks for considering Fieldnote Studio. This quotation covers the work listed above. Any additional requests will be scoped and priced separately.");
  const [items, setItems] = useState(initialItems);
  const [taxRate, setTaxRate] = useState("0");
  const [reviewed, setReviewed] = useState(false);
  const [activeSection, setActiveSection] = useState("details");
  const [showBusiness, setShowBusiness] = useState(true);
  const [showClient, setShowClient] = useState(true);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.price) || 0), 0),
    [items]
  );
  const tax = subtotal * Math.max(0, Number(taxRate) || 0) / 100;
  const total = subtotal + tax;

  const updateBusiness = (key, value) => {
    setBusiness((current) => ({ ...current, [key]: value }));
    setReviewed(false);
  };
  const updateClient = (key, value) => {
    setClient((current) => ({ ...current, [key]: value }));
    setReviewed(false);
  };
  const updateItem = (id, key, value) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [key]: value } : item));
    setReviewed(false);
  };
  const addItem = () => {
    setItems((current) => [...current, {
      id: Math.max(0, ...current.map((item) => item.id)) + 1,
      description: "",
      detail: "",
      quantity: 1,
      price: 0,
    }]);
    setReviewed(false);
  };
  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setReviewed(false);
  };

  const checks = useMemo(() => {
    const hasBusiness = Boolean(business.name.trim() && business.email.trim());
    const hasClient = Boolean(client.name.trim());
    const hasItems = items.length > 0 && items.every((item) => item.description.trim() && Number(item.quantity) > 0 && Number(item.price) >= 0);
    const hasPricedWork = items.some((item) => Number(item.price) > 0);
    const hasValidity = Boolean(issuedAt && validUntil && validUntil >= issuedAt);
    return [
      { label: "Business details", detail: hasBusiness ? "Name and email are included" : "Add a business name and email", ok: hasBusiness },
      { label: "Customer details", detail: hasClient ? "Customer is identified" : "Add the customer's name", ok: hasClient },
      { label: "Line items", detail: hasItems && hasPricedWork ? "Descriptions, quantities and rates are present" : "Complete each line and add a priced item", ok: hasItems && hasPricedWork },
      { label: "Quotation dates", detail: hasValidity ? "Expiry date follows the issue date" : "Check the issue and expiry dates", ok: hasValidity },
      { label: "Arithmetic", detail: "Amounts and totals are calculated by the app", ok: true },
    ];
  }, [business, client, items, issuedAt, validUntil]);

  const runPreflight = () => {
    setReviewed(true);
    setActiveSection("review");
  };
  const allPassed = checks.every((check) => check.ok);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Scope and Sum home">
          <span className="brand-mark"><span>S</span><i /></span>
          <span className="brand-wordmark">scope<span>&</span>sum</span>
        </a>
        <div className="topbar-center">
          <span className="workspace-label">WORKSPACE</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-current">New quotation</span>
          <span className="draft-chip"><i /> Draft</span>
        </div>
        <div className="topbar-actions">
          <button className="icon-button help-button" type="button" aria-label="Help"><CircleHelp size={17} /></button>
          <span className="topbar-divider" />
          <button className="user-menu" type="button">
            <span className="user-avatar">F</span>
            <span className="user-name">Fieldnote</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      <main className="page-wrap">
        <div className="page-heading">
          <div>
            <div className="eyebrow"><span>01</span> / QUOTATION WORKSPACE</div>
            <h1>Make the work <em>clear.</em></h1>
            <p className="page-intro">Put the details in place. We’ll take care of the sums.</p>
          </div>
          <div className="heading-meta">
            <span className="meta-label">DOCUMENT REF.</span>
            <strong>{reference || "Not assigned"}</strong>
            <span className="meta-sub">Last edited just now</span>
          </div>
        </div>

        <div className="workspace-grid">
          <section className="editor-column" aria-label="Quotation editor">
            <div className="editor-toolbar">
              <div className="section-tabs" role="tablist" aria-label="Editor sections">
                <button type="button" className={activeSection === "details" ? "section-tab active" : "section-tab"} onClick={() => setActiveSection("details")}>
                  <span>01</span> Details
                </button>
                <button type="button" className={activeSection === "review" ? "section-tab active" : "section-tab"} onClick={() => setActiveSection("review")}>
                  <span>02</span> Review
                </button>
              </div>
              <span className="autosave"><span className="save-dot" /> Changes saved locally</span>
            </div>

            {activeSection === "details" ? (
              <div className="editor-card">
                <section className="editor-section">
                  <div className="section-heading">
                    <div className="section-icon"><Building2 size={17} /></div>
                    <div>
                      <h2>Your business</h2>
                      <p>Who is sending this quotation?</p>
                    </div>
                    <button type="button" className="collapse-button" onClick={() => setShowBusiness(!showBusiness)} aria-label="Toggle business details">
                      {showBusiness ? <ChevronDown size={17} /> : <ArrowDownRight size={17} />}
                    </button>
                  </div>
                  {showBusiness && (
                    <div className="fields-grid">
                      <Field label="Business name" value={business.name} onChange={(value) => updateBusiness("name", value)} placeholder="Your business name" />
                      <Field label="Email address" type="email" value={business.email} onChange={(value) => updateBusiness("email", value)} placeholder="you@business.com" />
                      <Field label="Phone number" value={business.phone} onChange={(value) => updateBusiness("phone", value)} placeholder="+234 ..." />
                      <Field label="Business address" value={business.address} onChange={(value) => updateBusiness("address", value)} placeholder="Street, city" />
                    </div>
                  )}
                </section>

                <div className="section-rule" />

                <section className="editor-section">
                  <div className="section-heading">
                    <div className="section-icon rust"><FileText size={17} /></div>
                    <div>
                      <h2>Prepared for</h2>
                      <p>Who will receive this quotation?</p>
                    </div>
                    <button type="button" className="collapse-button" onClick={() => setShowClient(!showClient)} aria-label="Toggle customer details">
                      {showClient ? <ChevronDown size={17} /> : <ArrowDownRight size={17} />}
                    </button>
                  </div>
                  {showClient && (
                    <div className="fields-grid">
                      <Field label="Customer / company" value={client.name} onChange={(value) => updateClient("name", value)} placeholder="Customer name" />
                      <Field label="Customer email" type="email" value={client.email} onChange={(value) => updateClient("email", value)} placeholder="customer@example.com" />
                      <Field label="Customer address" className="full-field" value={client.address} onChange={(value) => updateClient("address", value)} placeholder="Address, city" />
                    </div>
                  )}
                </section>

                <div className="section-rule" />

                <section className="editor-section">
                  <div className="section-heading">
                    <div className="section-icon gold"><CalendarDays size={17} /></div>
                    <div>
                      <h2>Quote details</h2>
                      <p>Give the work a name and a timeframe.</p>
                    </div>
                  </div>
                  <div className="fields-grid">
                    <Field label="Project / quotation title" className="full-field" value={title} onChange={setTitle} placeholder="What is this quote for?" />
                    <Field label="Reference number" value={reference} onChange={setReference} placeholder="e.g. Q-001" />
                    <label className="field">
                      <span className="field-label">Currency</span>
                      <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                        <option value="NGN">NGN · Nigerian naira</option>
                        <option value="USD">USD · US dollar</option>
                        <option value="GBP">GBP · British pound</option>
                      </select>
                    </label>
                    <Field label="Issue date" type="date" value={issuedAt} onChange={setIssuedAt} />
                    <Field label="Valid until" type="date" value={validUntil} onChange={setValidUntil} />
                  </div>
                </section>

                <div className="section-rule" />

                <section className="editor-section items-section">
                  <div className="section-heading items-heading">
                    <div className="section-icon green"><ClipboardCheck size={17} /></div>
                    <div>
                      <h2>Scope & pricing</h2>
                      <p>Be specific about what’s included.</p>
                    </div>
                    <span className="item-count">{items.length} {items.length === 1 ? "item" : "items"}</span>
                  </div>

                  <div className="line-editor">
                    <div className="line-editor-head">
                      <span>DESCRIPTION</span>
                      <span>QTY</span>
                      <span>RATE ({currency})</span>
                      <span />
                    </div>
                    {items.map((item, index) => (
                      <div className="line-editor-row" key={item.id}>
                        <div className="line-description">
                          <input
                            aria-label={"Item " + (index + 1) + " description"}
                            value={item.description}
                            onChange={(event) => updateItem(item.id, "description", event.target.value)}
                            placeholder="Service or product"
                          />
                          <input
                            aria-label={"Item " + (index + 1) + " detail"}
                            className="line-detail-input"
                            value={item.detail}
                            onChange={(event) => updateItem(item.id, "detail", event.target.value)}
                            placeholder="A short description (optional)"
                          />
                        </div>
                        <input
                          aria-label={"Item " + (index + 1) + " quantity"}
                          className="qty-input"
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
                        />
                        <input
                          aria-label={"Item " + (index + 1) + " rate"}
                          className="rate-input"
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(event) => updateItem(item.id, "price", event.target.value)}
                        />
                        <button className="remove-line" type="button" onClick={() => removeItem(item.id)} aria-label="Remove line item"><Trash2 size={15} /></button>
                      </div>
                    ))}
                    <button type="button" className="add-line-button" onClick={addItem}>
                      <Plus size={15} /> Add a line item
                    </button>
                  </div>

                  <div className="totals-editor">
                    <div className="tax-control">
                      <span className="field-label">Tax rate</span>
                      <div className="tax-input-wrap">
                        <input aria-label="Tax percentage" type="number" min="0" max="100" step="0.5" value={taxRate} onChange={(event) => { setTaxRate(event.target.value); setReviewed(false); }} />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="totals-mini">
                      <div><span>Subtotal</span><strong>{money(subtotal, currency)}</strong></div>
                      <div><span>Tax</span><strong>{money(tax, currency)}</strong></div>
                      <div className="total-row"><span>Total</span><strong>{money(total, currency)}</strong></div>
                    </div>
                  </div>
                </section>

                <div className="section-rule" />

                <section className="editor-section notes-section">
                  <div className="section-heading">
                    <div className="section-icon pale"><FileCheck2 size={17} /></div>
                    <div>
                      <h2>Notes & terms</h2>
                      <p>Anything the customer should know?</p>
                    </div>
                  </div>
                  <label className="field">
                    <textarea value={notes} onChange={(event) => { setNotes(event.target.value); setReviewed(false); }} rows="3" placeholder="Add payment terms, delivery notes or a simple thank you..." />
                  </label>
                </section>

                <div className="editor-footer">
                  <span><ShieldCheck size={15} /> Your numbers update as you edit.</span>
                  <button type="button" className="primary-button" onClick={runPreflight}>Review quotation <ArrowUpRight size={16} /></button>
                </div>
              </div>
            ) : (
              <div className="review-card">
                <div className="review-card-top">
                  <div className="review-emblem"><ShieldCheck size={22} /></div>
                  <div>
                    <span className="eyebrow">PRE-SEND CHECK</span>
                    <h2>Give it one last look.</h2>
                    <p>Catch missing details before the quotation reaches your customer.</p>
                  </div>
                </div>
                {!reviewed ? (
                  <div className="review-empty">
                    <div className="review-empty-icon"><ClipboardCheck size={24} /></div>
                    <h3>Ready when you are.</h3>
                    <p>Run a quick local check on the business details, customer, line items, dates and arithmetic.</p>
                    <button type="button" className="primary-button" onClick={runPreflight}>Run preflight checks <ArrowUpRight size={16} /></button>
                  </div>
                ) : (
                  <div className="review-results">
                    <div className={allPassed ? "review-result-banner passed" : "review-result-banner needs-work"}>
                      {allPassed ? <CheckCircle2 size={20} /> : <CircleHelp size={20} />}
                      <div>
                        <strong>{allPassed ? "Your draft is complete" : "A few details need attention"}</strong>
                        <span>{checks.filter((check) => check.ok).length} of {checks.length} local checks passed</span>
                      </div>
                    </div>
                    {checks.map((check) => (
                      <div className="check-row" key={check.label}>
                        <span className={check.ok ? "check-icon ok" : "check-icon fail"}>{check.ok ? <Check size={14} /> : <X size={14} />}</span>
                        <div><strong>{check.label}</strong><span>{check.detail}</span></div>
                        <span className={check.ok ? "check-state good" : "check-state bad"}>{check.ok ? "Passed" : "Fix"}</span>
                      </div>
                    ))}
                    <div className="reppo-notice">
                      <div className="reppo-lock"><ShieldCheck size={17} /></div>
                      <div>
                        <strong>Independent Reppo review</strong>
                        <p>Not connected yet. This preview checks document completeness and arithmetic locally. Reppo evaluation will be added as a separate review step.</p>
                      </div>
                      <span className="coming-tag">NEXT</span>
                    </div>
                    <button type="button" className="secondary-button" onClick={() => setActiveSection("details")}>Back to edit <ArrowDownRight size={15} /></button>
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="preview-column" aria-label="Live quotation preview">
            <div className="preview-topline">
              <div>
                <span className="eyebrow">LIVE PREVIEW</span>
                <span className="preview-subtitle">What your customer will see</span>
              </div>
              <button type="button" className="print-button" onClick={() => window.print()}><Printer size={15} /> Export PDF</button>
            </div>

            <article className="quote-paper">
              <div className="paper-top">
                <div className="paper-brand">
                  <span className="paper-monogram">S<span>.</span></span>
                  <div><strong>{business.name || "Your business"}</strong><span>{business.address}</span></div>
                </div>
                <div className="paper-type">
                  <span>DOCUMENT</span>
                  <strong>QUOTATION</strong>
                  <small>{reference || "DRAFT"}</small>
                </div>
              </div>

              <div className="paper-title-block">
                <span className="paper-kicker">A CLEAR AGREEMENT STARTS HERE</span>
                <h2>{title || "Untitled quotation"}</h2>
                <div className="paper-title-rule" />
              </div>

              <div className="paper-parties">
                <div>
                  <span className="paper-label">PREPARED FOR</span>
                  <strong>{client.name || "Customer name"}</strong>
                  <span>{client.email}</span>
                  <span>{client.address}</span>
                </div>
                <div className="paper-dates">
                  <div><span className="paper-label">ISSUED</span><strong>{prettyDate(issuedAt)}</strong></div>
                  <div><span className="paper-label">VALID UNTIL</span><strong>{prettyDate(validUntil)}</strong></div>
                </div>
              </div>

              <div className="paper-items">
                <div className="paper-table-head">
                  <span>DESCRIPTION</span><span>QTY</span><span>RATE</span><span>AMOUNT</span>
                </div>
                {items.map((item) => (
                  <div className="paper-item" key={item.id}>
                    <div><strong>{item.description || "Untitled item"}</strong>{item.detail && <span>{item.detail}</span>}</div>
                    <span>{item.quantity || 0}</span>
                    <span>{money(item.price, currency)}</span>
                    <strong>{money((Number(item.quantity) || 0) * (Number(item.price) || 0), currency)}</strong>
                  </div>
                ))}
                {items.length === 0 && <div className="paper-empty">Your line items will appear here.</div>}
              </div>

              <div className="paper-bottom">
                <div className="paper-note">
                  <span className="paper-label">A NOTE FROM US</span>
                  <p>{notes || "No additional notes."}</p>
                  <span className="paper-signoff">Thank you for the opportunity.</span>
                </div>
                <div className="paper-total">
                  <div><span>Subtotal</span><strong>{money(subtotal, currency)}</strong></div>
                  <div><span>Tax ({Number(taxRate) || 0}%)</span><strong>{money(tax, currency)}</strong></div>
                  <div className="paper-grand-total"><span>TOTAL DUE</span><strong>{money(total, currency)}</strong></div>
                </div>
              </div>

              <div className="paper-footer">
                <span>{business.email || "Business email"} {business.phone && "· " + business.phone}</span>
                <span>MADE WITH CARE <i>✳</i></span>
              </div>
              <div className="paper-watermark">SCOPE & SUM</div>
            </article>

            <div className="preview-footnote">
              <span className="preview-footnote-icon"><Check size={13} /></span>
              <p>Live preview. Changes on the left appear here instantly.</p>
              <span className="preview-live">LIVE</span>
            </div>

            <div className="review-teaser">
              <div className="teaser-icon"><ShieldCheck size={18} /></div>
              <div>
                <strong>A second set of eyes.</strong>
                <p>Local checks are ready. Independent Reppo review is the next integration.</p>
              </div>
              <button type="button" className="teaser-arrow" onClick={runPreflight} aria-label="Open review"><ArrowUpRight size={17} /></button>
            </div>
          </aside>
        </div>

        <footer className="app-footer">
          <span>Scope & Sum <i>·</i> Clear quotes, fewer surprises.</span>
          <span>BUILT FOR THE DETAILS THAT MATTER</span>
        </footer>
      </main>
    </div>
  );
}

export default App;