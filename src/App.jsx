import React from "react";
import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowRight, Plus, Trash2, FileText, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, LoaderCircle, Printer, RotateCcw, Building2, Store, BookOpen, HelpCircle, ChevronDown, ClipboardCheck, MessageCircle } from "lucide-react";

const initialProfile = { name: "Fieldnote Studio", email: "hello@fieldnote.studio", phone: "+234 801 234 5678", address: "Lagos, Nigeria", currency: "NGN", taxRate: 0, terms: "50% deposit to begin. Remaining balance due on delivery. This quotation is valid for 14 days." };
const sampleCatalogue = [
  { id: 1, name: "Brand identity direction", description: "Concept, visual direction and logo suite", price: 480000 },
  { id: 2, name: "Social launch templates", description: "Six editable templates for social channels", price: 160000 },
  { id: 3, name: "Packaging artwork", description: "Print-ready packaging layouts", price: 62500 }
];
const fmt = (n, currency) => new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(n) || 0);
const today = new Date().toISOString().slice(0,10);
const plus14 = new Date(Date.now()+14*86400000).toISOString().slice(0,10);


function Landing({onEnter,onHelp}){
 return <div className="ss-site"><header className="ss-site-nav"><a className="ss-brand" href="#"><span className="ss-mark">S<span>.</span></span><span>scope<span>&</span>sum</span></a><nav><a href="#how">How it works</a><a href="#business">For businesses</a><button onClick={onHelp}>Help & FAQ</button></nav><button className="ss-primary" onClick={onEnter}>Open workspace <ArrowRight size={15}/></button></header>
 <main className="ss-site-main"><section className="ss-site-hero"><div><div className="ss-kicker">QUOTATIONS THAT ADD UP</div><h1>Good work deserves<br/><em>a clear price.</em></h1><p>Turn a customer's request into a thoughtful quotation. SERV helps shape the scope, your catalogue keeps prices honest, and Reppo gives the draft another look.</p><div className="ss-hero-actions"><button className="ss-primary ss-large" onClick={onEnter}>Create a quotation <ArrowRight size={16}/></button><a href="#how" className="ss-text-link">See how it works <ArrowUpRight size={15}/></a></div><div className="ss-hero-proof"><span><CheckCircle2 size={14}/> You control the prices</span><span><CheckCircle2 size={14}/> You approve before sending</span></div></div>
 <div className="ss-hero-art"><div className="ss-art-label">A CUSTOMER BRIEF</div><blockquote>“We need a new identity, launch materials and packaging for our product.”</blockquote><div className="ss-art-step"><span><Sparkles size={17}/></span><div><b>SERV Reasoning</b><small>Shapes the request into a scope</small></div><CheckCircle2 size={16}/></div><div className="ss-art-step"><span className="peach"><ClipboardCheck size={17}/></span><div><b>Your service catalogue</b><small>Applies your approved prices</small></div><CheckCircle2 size={16}/></div><div className="ss-art-step"><span className="sage"><ShieldCheck size={17}/></span><div><b>Reppo review</b><small>Checks the quotation independently</small></div><small className="ss-review-tag">REVIEW</small></div><div className="ss-art-caption">A clearer process, from first brief to final document.</div></div></section>
 <section className="ss-site-trust"><span>MADE FOR SERVICE BUSINESSES</span><div><b>Creative studios</b><i/><b>Consultants</b><i/><b>Freelancers</b><i/><b>Small teams</b></div></section>
 <section className="ss-site-section" id="how"><div className="ss-kicker">HOW IT WORKS</div><h2>From “how much?”<br/><em>to a clear proposal.</em></h2><p className="ss-section-lead">Each part has one job. You stay in control of the final quotation.</p><div className="ss-how-grid"><article><span>01</span><MessageCircle/><h3>Start with the request</h3><p>Paste what the customer asked for, or write the quotation yourself, line by line.</p></article><article><span>02</span><Sparkles/><h3>SERV shapes the scope</h3><p>SERV turns the brief into a structured draft using your business details and catalogue.</p></article><article><span>03</span><ShieldCheck/><h3>Reppo reviews the draft</h3><p>Send it for an independent assessment of clarity, completeness and consistency.</p></article><article><span>04</span><FileText/><h3>You approve and export</h3><p>Make final edits, check the document preview, then print or save it as a PDF.</p></article></div></section>
 <section className="ss-site-feature" id="business"><div><div className="ss-kicker">YOUR BUSINESS, IN ONE PLACE</div><h2>Show what you offer<br/><em>before you quote.</em></h2><p>Keep your business details, services, descriptions and rates together. Use your catalogue as a service menu when preparing a customer's quotation.</p><button className="ss-primary" onClick={onEnter}>Set up your business <ArrowRight size={15}/></button></div><div className="ss-feature-card"><div className="ss-feature-head">YOUR SERVICE MENU <span>CATALOGUE PREVIEW</span></div>{["Brand identity · Direction and logo suite","Content & launch · Social templates and assets","Consulting · Discovery and advisory"].map(x=><div className="ss-feature-row" key={x}><b>{x.split(" · ")[0]}</b><small>{x.split(" · ")[1]}</small><strong>YOUR RATE</strong></div>)}<div className="ss-feature-foot"><Store size={15}/> Your catalogue is the source of truth for prices.</div></div></section>
 <section className="ss-site-faq"><div><div className="ss-kicker">GOOD QUESTIONS</div><h2>New to Scope & Sum?</h2><p>We explain each part in plain language, including what the AI does and what stays in your hands.</p><button className="ss-text-link" onClick={onHelp}>Visit the help centre <ArrowRight size={15}/></button></div><div className="ss-faq-mini"><p><b>Does SERV choose my prices?</b><span>No. It can only use rates from your catalogue.</span></p><p><b>Does Reppo send the quotation?</b><span>No. Reppo reviews the draft. You decide what happens next.</span></p><p><b>Can I write a quote myself?</b><span>Yes. You can edit every field or start from scratch.</span></p></div></section>
 <section className="ss-site-bottom"><div className="ss-kicker">READY WHEN YOU ARE</div><h2>Make your next quote<br/><em>easier to stand behind.</em></h2><button className="ss-primary ss-large" onClick={onEnter}>Enter Scope & Sum <ArrowRight size={16}/></button></section></main><footer className="ss-site-footer"><span>Scope & Sum · Clear quotes, fewer surprises.</span><button onClick={onHelp}>Help & FAQ</button></footer></div>;
}
function HelpCenter({onBack,onEnter}){
 const [open,setOpen]=useState(0),[search,setSearch]=useState("");
 const faqs=[["What is Scope & Sum?","Scope & Sum helps service businesses prepare clear quotations. Describe a customer's request, build a quote manually, review the document and export it."],["What does SERV do?","SERV Reasoning helps turn a customer's brief into a structured quotation draft using your business profile and service catalogue."],["Can SERV invent a service or set a price?","No. The generation endpoint checks every suggested service against your catalogue and replaces the model's price with your saved rate. Work outside the catalogue should be scoped manually."],["What is the business catalogue?","It is your list of services, descriptions and prices. Keep it up to date because it is the source used when generating a quotation."],["Can customers see my business offerings?","The workspace includes a service-menu preview of your catalogue. A public, shareable business page is a separate feature and is not published yet."],["What does Reppo review?","Reppo receives the quotation and its context for an independent assessment. It can flag unclear scope, missing details, pricing mismatches and unsupported assumptions. It is not legal or tax certification."],["Does Reppo approve or send the quote?","No. Reppo returns an evaluation. You remain responsible for reviewing feedback and deciding whether to send the quotation."],["Can I write a quotation without AI?","Yes. Type directly into the quotation title, line items, quantities, rates, customer details and notes."],["How do I export a quotation?","Choose Print / PDF in the live document preview. In the print dialog, select Save as PDF."],["Where is my business information saved?","The current profile and catalogue are saved in this browser. They are not yet a shared team database."]];
 const filtered=faqs.filter(([q,a])=>(q+" "+a).toLowerCase().includes(search.toLowerCase()));
 return <div className="ss-help-page"><header><button className="ss-brand" onClick={onBack}><span className="ss-mark">S<span>.</span></span><span>scope<span>&</span>sum</span></button><button className="ss-text-link" onClick={onEnter}>Open workspace <ArrowRight size={15}/></button></header><main><div className="ss-kicker">HELP CENTRE / THE BASICS</div><h1>Questions, <em>answered.</em></h1><p className="ss-help-lead">A plain-language guide to the people, tools and steps behind every quotation.</p><label className="ss-help-search"><HelpCircle size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search a question or feature"/></label><div className="ss-help-list">{filtered.map(([q,a],i)=><article key={q}><button onClick={()=>setOpen(open===i?-1:i)}><span>{q}</span><ChevronDown size={17}/></button>{open===i&&<p>{a}</p>}</article>)}{!filtered.length&&<p>No matching questions. Try another search.</p>}</div><div className="ss-help-callout"><BookOpen size={20}/><div><b>Still finding your way?</b><p>Start with your business profile. You can return to this guide whenever you need it.</p></div><button className="ss-primary" onClick={onEnter}>Go to workspace <ArrowRight size={15}/></button></div></main></div>;
}
function Storefront({profile,catalogue,onEdit,onQuote}){
 return <div className="ss-panel ss-storefront"><div className="ss-store-cover"><span>BUSINESS SERVICE MENU</span><Store size={20}/></div><div className="ss-store-business"><div><h2>{profile.name||"Your business"}</h2><p>{profile.address} · {profile.email}</p></div><button className="ss-small-button" onClick={onEdit}>Edit business details</button></div><div className="ss-store-intro"><div><div className="ss-kicker">WHAT WE OFFER</div><h2>Services & pricing</h2><p>A clear view of the work your business provides. Rates come from your saved catalogue.</p></div><span>{catalogue.length} SERVICES</span></div><div className="ss-store-grid">{catalogue.map((item,i)=><article key={item.id}><span>0{i+1}</span><h3>{item.name||"Untitled service"}</h3><p>{item.description||"Add a short description of what's included."}</p><small>RATE</small><strong>{fmt(item.price,profile.currency)}</strong></article>)}</div><div className="ss-store-actions"><p>Workspace preview only. This is not a published customer-facing page.</p><button className="ss-primary" onClick={onQuote}>Prepare a quotation <ArrowRight size={15}/></button></div></div>;
}

function App() {
  const [profile,setProfile] = useState(()=>{try{const saved=JSON.parse(localStorage.getItem("ss-profile")||"{}");const merged={...initialProfile,...(saved&&typeof saved==="object"&&!Array.isArray(saved)?saved:{})};for(const key of ["name","email","phone","address","currency","terms"])if(typeof merged[key]!=="string")merged[key]=initialProfile[key];if(!["NGN","USD","GBP"].includes(merged.currency))merged.currency="NGN";return merged;}catch{return {...initialProfile}}});
  const [catalogue,setCatalogue] = useState(()=>{try{const saved=JSON.parse(localStorage.getItem("ss-catalogue")||"null");return Array.isArray(saved)?saved.filter(x=>x&&typeof x==="object").map((x,i)=>({id:x.id??i+1,name:typeof x.name==="string"?x.name:"",description:typeof x.description==="string"?x.description:"",price:Number.isFinite(Number(x.price))?Number(x.price):0})):sampleCatalogue;}catch{return sampleCatalogue}});
  const [customer,setCustomer] = useState({name:"Aster & Co.",email:"finance@asterand.co",address:"Victoria Island, Lagos"});
  const [request,setRequest] = useState("We need a new brand identity, six social media launch templates, and packaging artwork for two product variants. Please include a clear scope, delivery notes and a 50% deposit.");
  const [quote,setQuote] = useState({title:"Brand identity & launch",reference:"SS-2026-014",issuedAt:today,validUntil:plus14,notes:"Thank you for considering Fieldnote Studio.",items:[
    {id:1,description:"Brand identity direction",detail:"Concept, visual direction and logo suite",quantity:1,price:480000},
    {id:2,description:"Social launch templates",detail:"Six editable templates for social channels",quantity:1,price:160000},
    {id:3,description:"Packaging artwork",detail:"Print-ready packaging layouts",quantity:2,price:62500}
  ]});
  const [page,setPage] = useState("home");
  const [tab,setTab] = useState("quote");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [evalId,setEvalId] = useState("");
  const [evalState,setEvalState] = useState(null);
  const [evalBusy,setEvalBusy] = useState(false);
  const [generationMeta,setGenerationMeta] = useState(null);
  const subtotal = useMemo(()=>quote.items.reduce((s,i)=>s+Math.max(0,Number(i.quantity)||0)*Math.max(0,Number(i.price)||0),0),[quote.items]);
  const tax = subtotal*(Math.max(0,Number(profile.taxRate)||0)/100);
  const total = subtotal+tax;
  const updateProfile=(k,v)=>setProfile(p=>{const n={...p,[k]:v};localStorage.setItem("ss-profile",JSON.stringify(n));return n});
  const updateItem=(id,k,v)=>setQuote(q=>({...q,items:q.items.map(i=>i.id===id?{...i,[k]:v}:i)}));
  const addItem=()=>setQuote(q=>({...q,items:[...q.items,{id:Date.now(),description:"",detail:"",quantity:1,price:0}]}));
  const generate=async()=>{
    setBusy(true);setError("");setEvalId("");setEvalState(null);setGenerationMeta(null);
    try{
      const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request,profile,catalogue,customer,quoteContext:{reference:quote.reference,issuedAt:quote.issuedAt,validUntil:quote.validUntil,notes:quote.notes}})});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not generate the quotation.");
      setQuote(q=>({...q,title:data.quote.title||q.title,notes:data.quote.notes||q.notes,items:data.quote.items.map((i,index)=>({...i,id:Date.now()+index}))}));
      setGenerationMeta({model:data.model||"SERV Reasoning",createdAt:new Date().toISOString()});setTab("quote");
    }catch(e){setError(e.message||"Something went wrong.");}
    finally{setBusy(false);}
  };
  const review=async()=>{
    setEvalBusy(true);setError("");setEvalState(null);
    try{
      const payload={business:profile,customer,request,quote:{...quote,items:quote.items.map(i=>({...i,amount:(Number(i.quantity)||0)*(Number(i.price)||0)})),subtotal,tax,taxRate:profile.taxRate,total,currency:profile.currency}};
      const res=await fetch("/api/evaluations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not submit the Reppo evaluation.");
      setEvalId(data.evalId);setEvalState(data.status?{status:data.status}: {status:"submitted"});setTab("review");
    }catch(e){setError(e.message||"Reppo review failed.");}
    finally{setEvalBusy(false);}
  };
  const refreshReview=async()=>{
    if(!evalId)return;setEvalBusy(true);setError("");
    try{const res=await fetch("/api/evaluations?id="+encodeURIComponent(evalId));const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not retrieve evaluation.");setEvalState(data);}
    catch(e){setError(e.message||"Could not refresh the evaluation.");}
    finally{setEvalBusy(false);}
  };
  const checks=[
    ["Business identity",Boolean(String(profile.name||"").trim()&&String(profile.email||"").trim())],
    ["Customer identified",Boolean(customer.name.trim())],
    ["Every item priced",quote.items.length>0&&quote.items.every(i=>i.description.trim()&&Number(i.quantity)>0&&Number(i.price)>=0)],
    ["Dates make sense",Boolean(quote.issuedAt&&quote.validUntil&&quote.validUntil>=quote.issuedAt)],
    ["Totals calculated",Number.isFinite(total)&&total>=0]
  ];
  const ready=checks.every(c=>c[1]);
  const addCatalogue=()=>{const item={id:Date.now(),name:"New service",description:"",price:0};const next=[...catalogue,item];setCatalogue(next);localStorage.setItem("ss-catalogue",JSON.stringify(next));};
  const saveCatalogue=(id,k,v)=>setCatalogue(items=>{const next=items.map(i=>i.id===id?{...i,[k]:v}:i);localStorage.setItem("ss-catalogue",JSON.stringify(next));return next;});
  return <>{page==="home"?<Landing onEnter={()=>setPage("workspace")} onHelp={()=>setPage("help")}/>:page==="help"?<HelpCenter onBack={()=>setPage("home")} onEnter={()=>setPage("workspace")}/>:<div className="ss-app">
    <header className="ss-nav"><button className="ss-brand" onClick={()=>setPage("home")}><span className="ss-mark">S<span>.</span></span><span>scope<span>&</span>sum</span></button><div className="ss-nav-meta">WORKSPACE <i>/</i> {tab==="profile"?"Business setup":tab==="review"?"Independent review":tab==="storefront"?"Service menu":"New quotation"}</div><button className="ss-nav-button" onClick={()=>setPage("help")}><HelpCircle size={15}/> Help</button><button className="ss-nav-button" onClick={()=>setTab("profile")}><Building2 size={15}/> Business profile</button></header>
    <main className="ss-main">
      <section className="ss-heading"><div><div className="ss-kicker">QUOTATIONS, WITH A SECOND SET OF EYES</div><h1>Make the work <em>clear.</em></h1><p>Turn a customer's request into a priced scope, then get an independent review before it leaves your desk.</p></div><div className="ss-heading-mark">01 <span>/</span> 03</div></section>
      <div className="ss-layout"><section className="ss-work">
        <div className="ss-tabs"><button className={tab==="quote"?"active":""} onClick={()=>setTab("quote")}>01 &nbsp; Quotation</button><button className={tab==="storefront"?"active":""} onClick={()=>setTab("storefront")}>02 &nbsp; Service menu</button><button className={tab==="review"?"active":""} onClick={()=>setTab("review")}>03 &nbsp; Reppo review</button><button className={tab==="profile"?"active":""} onClick={()=>setTab("profile")}>04 &nbsp; Business & rates</button></div>
        {tab==="storefront"&&<Storefront profile={profile} catalogue={catalogue} onEdit={()=>setTab("profile")} onQuote={()=>setTab("quote")}/>}
        {tab==="profile"&&<div className="ss-panel"><div className="ss-panel-head"><span className="ss-icon"><Building2 size={18}/></span><div><h2>Your business profile</h2><p>These details and rates are used when SERV drafts quotations.</p></div></div><div className="ss-form-grid">
          {["name","email","phone","address"].map(k=><label className="ss-field" key={k}><span>{k==="name"?"BUSINESS NAME":k.toUpperCase()}</span><input value={profile[k]} onChange={e=>updateProfile(k,e.target.value)}/></label>)}
          <label className="ss-field"><span>CURRENCY</span><select value={profile.currency} onChange={e=>updateProfile("currency",e.target.value)}><option value="NGN">NGN · Nigerian naira</option><option value="USD">USD · US dollar</option><option value="GBP">GBP · British pound</option></select></label>
          <label className="ss-field"><span>TAX RATE (%)</span><input type="number" min="0" max="100" value={profile.taxRate} onChange={e=>updateProfile("taxRate",e.target.value)}/></label>
          <label className="ss-field ss-full"><span>DEFAULT PAYMENT TERMS</span><textarea value={profile.terms} onChange={e=>updateProfile("terms",e.target.value)}/></label>
        </div><div className="ss-divider"/><div className="ss-panel-head"><span className="ss-icon warm"><FileText size={18}/></span><div><h2>Service catalogue</h2><p>Use your own prices. SERV can only quote services listed here.</p></div><button className="ss-small-button" onClick={addCatalogue}><Plus size={14}/> Add service</button></div>
          {catalogue.map(item=><div className="ss-catalogue-row" key={item.id}><input aria-label="Service name" value={item.name} onChange={e=>saveCatalogue(item.id,"name",e.target.value)}/><input aria-label="Service description" value={item.description} placeholder="Scope / what's included" onChange={e=>saveCatalogue(item.id,"description",e.target.value)}/><input aria-label="Service price" type="number" value={item.price} onChange={e=>saveCatalogue(item.id,"price",e.target.value)}/><button className="ss-icon-button" onClick={()=>{const n=catalogue.filter(x=>x.id!==item.id);setCatalogue(n);localStorage.setItem("ss-catalogue",JSON.stringify(n));}}><Trash2 size={14}/></button></div>)}
          <p className="ss-hint">Your profile and catalogue are saved in this browser. They are not sent to Reppo.</p>
        </div>}
        {tab==="quote"&&<div className="ss-panel">
          <div className="ss-panel-head"><span className="ss-icon"><Sparkles size={18}/></span><div><h2>Start with the customer's request</h2><p>SERV Reasoning turns this brief into a quotation using your catalogue.</p></div><span className="ss-powered">POWERED BY SERV</span></div>
          <label className="ss-field"><span>CUSTOMER REQUEST</span><textarea className="ss-request" value={request} onChange={e=>setRequest(e.target.value)} placeholder="Describe what the customer needs..."/></label>
          <div className="ss-form-grid ss-customer-grid">
            <label className="ss-field"><span>CUSTOMER / COMPANY</span><input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label>
            <label className="ss-field"><span>CUSTOMER EMAIL</span><input value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></label>
            <label className="ss-field ss-full"><span>CUSTOMER ADDRESS</span><input value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/></label>
          </div>
          <div className="ss-action-row"><span className="ss-hint">SERV is restricted to your saved service catalogue and prices.</span><button className="ss-primary" disabled={busy||!request.trim()} onClick={generate}>{busy?<><LoaderCircle className="ss-spin" size={16}/> Drafting...</>:<>Generate quotation <ArrowUpRight size={16}/></>}</button></div>
          {error&&<div className="ss-error"><AlertTriangle size={16}/>{error}</div>}
          {generationMeta&&<div className="ss-success"><CheckCircle2 size={16}/> Draft generated with {generationMeta.model}. Review every line before sending.</div>}
          <div className="ss-divider"/>
          <div className="ss-panel-head"><span className="ss-icon warm"><FileText size={18}/></span><div><h2>Quotation details</h2><p>Edit the draft and see the document update on the right.</p></div></div>
          <div className="ss-form-grid">
            <label className="ss-field ss-full"><span>PROJECT / QUOTATION TITLE</span><input value={quote.title} onChange={e=>setQuote({...quote,title:e.target.value})}/></label>
            <label className="ss-field"><span>REFERENCE</span><input value={quote.reference} onChange={e=>setQuote({...quote,reference:e.target.value})}/></label>
            <label className="ss-field"><span>ISSUED ON</span><input type="date" value={quote.issuedAt} onChange={e=>setQuote({...quote,issuedAt:e.target.value})}/></label>
            <label className="ss-field"><span>VALID UNTIL</span><input type="date" value={quote.validUntil} onChange={e=>setQuote({...quote,validUntil:e.target.value})}/></label>
          </div>
          <div className="ss-line-head"><span>SCOPE / DELIVERABLE</span><span>QTY</span><span>RATE · {profile.currency}</span><span></span></div>
          {quote.items.map((item)=><div className="ss-line" key={item.id}><div><input value={item.description} placeholder="Service name" onChange={e=>updateItem(item.id,"description",e.target.value)}/><input className="ss-detail" value={item.detail||""} placeholder="What's included" onChange={e=>updateItem(item.id,"detail",e.target.value)}/></div><input type="number" min="1" value={item.quantity} onChange={e=>updateItem(item.id,"quantity",e.target.value)}/><input type="number" min="0" value={item.price} onChange={e=>updateItem(item.id,"price",e.target.value)}/><button className="ss-icon-button" onClick={()=>setQuote({...quote,items:quote.items.filter(x=>x.id!==item.id)})}><Trash2 size={14}/></button></div>)}
          <button className="ss-add-line" onClick={addItem}><Plus size={15}/> Add a line item</button>
          <label className="ss-field ss-notes"><span>NOTES & PAYMENT TERMS</span><textarea value={quote.notes} onChange={e=>setQuote({...quote,notes:e.target.value})}/></label>
          <div className="ss-total-line"><span>Subtotal</span><strong>{fmt(subtotal,profile.currency)}</strong></div><div className="ss-total-line"><span>Tax · {profile.taxRate}%</span><strong>{fmt(tax,profile.currency)}</strong></div><div className="ss-total-line ss-grand"><span>Total</span><strong>{fmt(total,profile.currency)}</strong></div>
          <div className="ss-action-row"><span className={ready?"ss-hint":"ss-hint ss-warning"}>{checks.filter(c=>c[1]).length}/5 preflight checks passed</span><button className="ss-primary" disabled={!ready||evalBusy} onClick={review}>{evalBusy?<><LoaderCircle className="ss-spin" size={16}/> Sending to Reppo...</>:<>Request independent review <ShieldCheck size={16}/></>}</button></div>
          {error&&<div className="ss-error"><AlertTriangle size={16}/>{error}</div>}
        </div>}
        {tab==="review"&&<div className="ss-panel"><div className="ss-panel-head"><span className="ss-icon"><ShieldCheck size={18}/></span><div><h2>Independent quotation review</h2><p>Reppo's independent judges review the output against your brief and business rules.</p></div></div>
          {!evalId?<div className="ss-empty"><ShieldCheck size={28}/><h3>No evaluation submitted yet</h3><p>Finish a quotation, then request an independent review.</p><button className="ss-primary" onClick={()=>setTab("quote")}>Return to quotation <ArrowUpRight size={15}/></button></div>:<><div className="ss-eval-id"><span>REPP0 EVALUATION ID</span><strong>{evalId}</strong><button className="ss-small-button" onClick={refreshReview} disabled={evalBusy}>{evalBusy?<LoaderCircle className="ss-spin" size={14}/>:<RotateCcw size={14}/>} Refresh verdict</button></div>
            <div className="ss-status"><span className="ss-status-dot"/><div><strong>{evalState?.status||"Submitted"}</strong><p>{evalState?.message||"The evaluation has been submitted. Independent judges need time to assess it."}</p></div></div>
            {evalState?.verdict&&<div className="ss-verdict"><div className="ss-score"><strong>{evalState.verdict.score??"—"}</strong><span>/ 100</span></div><div><span className="ss-kicker">REPP0 VERDICT · {evalState.verdict.decision||"PENDING"}</span><h3>{evalState.verdict.decision==="accept"?"Ready for your final approval":evalState.verdict.decision==="reject"?"Do not send this quotation":"Review the suggested changes"}</h3><p>Confidence: {evalState.verdict.confidence||"Not provided"} · Route: {evalState.action?.route||"Not provided"}</p></div></div>}
            {(evalState?.verdicts||[]).map((v,i)=><div className="ss-critique" key={i}><div><strong>{v.dimension||v.name||"Evaluation dimension"}</strong><span>{v.score??"—"}</span></div><p>{v.critique||v.feedback||v.reason||""}</p></div>)}
            {evalState?.error&&<div className="ss-error">{evalState.error}</div>}
            <p className="ss-hint">The verdict is an independent signal, not a legal or accounting certification. You remain responsible for approving the quotation.</p>
          </>}</div>}
      </section>
      <aside className="ss-preview"><div className="ss-preview-top"><div><span className="ss-kicker">LIVE DOCUMENT</span><p>Customer-facing quotation</p></div><button className="ss-small-button" onClick={()=>window.print()}><Printer size={14}/> Print / PDF</button></div>
        <article className="ss-paper"><div className="ss-paper-head"><div><div className="ss-paper-logo">S<span>.</span></div><strong>{profile.name||"Your business"}</strong><small>{profile.address} · {profile.email}</small></div><div className="ss-paper-type"><span>DOCUMENT</span><strong>QUOTATION</strong><small>{quote.reference}</small></div></div>
          <div className="ss-paper-title"><span>PROPOSAL / COST ESTIMATE</span><h2>{quote.title||"Untitled quotation"}</h2></div>
          <div className="ss-paper-parties"><div><span>PREPARED FOR</span><strong>{customer.name||"Customer name"}</strong><small>{customer.email}<br/>{customer.address}</small></div><div><span>ISSUED</span><strong>{quote.issuedAt}</strong><span>VALID UNTIL</span><strong>{quote.validUntil}</strong></div></div>
          <div className="ss-paper-table"><div className="ss-paper-th"><span>DESCRIPTION</span><span>QTY</span><span>RATE</span><span>AMOUNT</span></div>{quote.items.map(i=><div className="ss-paper-row" key={i.id}><div><strong>{i.description||"Unspecified work"}</strong><small>{i.detail}</small></div><span>{i.quantity}</span><span>{fmt(i.price,profile.currency)}</span><strong>{fmt((Number(i.quantity)||0)*(Number(i.price)||0),profile.currency)}</strong></div>)}</div>
          <div className="ss-paper-bottom"><div><span>NOTES & TERMS</span><p>{quote.notes||profile.terms}</p><small>{profile.phone}</small></div><div><div><span>SUBTOTAL</span><strong>{fmt(subtotal,profile.currency)}</strong></div><div><span>TAX</span><strong>{fmt(tax,profile.currency)}</strong></div><div className="ss-paper-total"><span>TOTAL DUE</span><strong>{fmt(total,profile.currency)}</strong></div></div></div>
          <footer>Prepared with care <span>·</span> {profile.name}</footer>
        </article>
        <div className="ss-preview-note"><ShieldCheck size={15}/><span>Every amount is recalculated by the application. AI cannot change your catalogue rates.</span></div>
      </aside></div>
      <footer className="ss-footer"><span>Scope & Sum <i>·</i> Clear quotes, fewer surprises.</span><span>SERV REASONING + REPPO EVALUATION</span></footer>
    </main>
  </div>}</>;
}
export default App;
