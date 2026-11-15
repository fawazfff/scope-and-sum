const SERV_BASE = "https://inference-api.openserv.ai/v1";
export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  if(!process.env.SERV_REASONING_API_KEY)return res.status(503).json({error:"SERV_REASONING_API_KEY is missing from Vercel Production environment variables."});
  try{
    const {request,profile,catalogue,customer,quoteContext={}}=req.body||{};
    if(typeof request!=="string"||!request.trim())return res.status(400).json({error:"Add the customer's request first."});
    if(!Array.isArray(catalogue)||!catalogue.length)return res.status(400).json({error:"Add at least one service to your business catalogue."});
    const auth={Authorization:"Bearer "+process.env.SERV_REASONING_API_KEY};
    const modelsRes=await fetch(SERV_BASE+"/models",{headers:auth});
    if(!modelsRes.ok)throw new Error("SERV model discovery failed ("+modelsRes.status+"). Check the SERV API key and account access.");
    const modelsData=await modelsRes.json();
    const models=Array.isArray(modelsData.data)?modelsData.data:[];
    const model=(process.env.SERV_REASONING_MODEL||models[0]?.id);
    if(!model)throw new Error("SERV did not return an available model.");
    const system=`You are the quotation specialist for a real business. Produce a clear, accurate quotation draft as JSON only. You MUST only select services present in the supplied catalogue. Never invent services, prices, discounts, taxes, delivery dates, guarantees or terms. Use exact catalogue unit prices. If the request asks for something not in the catalogue, do not price it; list it in exclusions as "Needs manual scoping". Quantity may be inferred only when explicitly clear from the customer request. Otherwise use 1 and explain the assumption in notes. Keep descriptions concise and specific. Currency is USD. Return this exact JSON shape: {"title":"...","notes":"...","items":[{"description":"exact catalogue service name","detail":"scope detail","quantity":1,"price":0}],"exclusions":["..."],"assumptions":["..."]}. No markdown fences.`;
    const user={customer,request,approvedBusinessCatalogue:catalogue.map(x=>({name:x.name,description:x.description,unitPrice:Number(x.price)})),businessRules:{businessName:profile?.name,currency:"USD",taxRate:Number(profile?.taxRate)||0,paymentTerms:profile?.terms},existingDocument:quoteContext};
    const completion=await fetch(SERV_BASE+"/chat/completions",{method:"POST",headers:{...auth,"Content-Type":"application/json"},body:JSON.stringify({model,messages:[{role:"system",content:system},{role:"user",content:JSON.stringify(user)}],temperature:0.2})});
    const body=await completion.json();
    if(!completion.ok)throw new Error(body.error?.message||"SERV generation failed ("+completion.status+").");
    const raw=body.choices?.[0]?.message?.content;
    if(!raw)throw new Error("SERV returned an empty response.");
    const cleaned=raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"").trim();
    let quote;try{quote=JSON.parse(cleaned)}catch{const match=cleaned.match(/\{[\s\S]*\}/);if(!match)throw new Error("SERV response was not valid quotation JSON. Please retry.");quote=JSON.parse(match[0]);}
    if(!Array.isArray(quote.items)||!quote.items.length)throw new Error("SERV could not match any requested work to your catalogue.");
    const allowed=new Map(catalogue.map(x=>[String(x.name).trim().toLowerCase(),Number(x.price)]));
    quote.items=quote.items.map(item=>{const key=String(item.description||"").trim().toLowerCase();if(!allowed.has(key))throw new Error("SERV returned a service outside your approved catalogue. No quotation was created.");const qty=Math.max(1,Math.min(1000,Number(item.quantity)||1));return {description:String(item.description),detail:String(item.detail||""),quantity:qty,price:allowed.get(key)};});
    quote.notes=[quote.notes||"",...(Array.isArray(quote.assumptions)&&quote.assumptions.length?["Assumptions: "+quote.assumptions.join("; ")]:[]),...(Array.isArray(quote.exclusions)&&quote.exclusions.length?["Needs manual scoping: "+quote.exclusions.join("; ")]:[]),profile?.terms||""].filter(Boolean).join("\n\n");
    return res.status(200).json({quote,model});
  }catch(error){console.error("SERV generation error:",error);return res.status(502).json({error:error.message||"SERV generation failed."});}
}