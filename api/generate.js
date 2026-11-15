const SERV_BASE = "https://inference-api.openserv.ai/v1";

function extractText(body){
  const message=body?.choices?.[0]?.message;
  const content=message?.content ?? body?.output_text ?? body?.content;
  if(typeof content==="string" && content.trim()) return content.trim();
  if(Array.isArray(content)) return content.map(part=>typeof part==="string"?part:(part?.text||part?.content||"")).join("\n").trim();
  if(content && typeof content==="object") return JSON.stringify(content);
  const toolCall=message?.tool_calls?.[0]?.function?.arguments;
  if(typeof toolCall==="string") return toolCall;
  return "";
}
function parseObject(raw){
  const cleaned=String(raw||"").replace(/^\s*```(?:json)?\s*/i,"").replace(/\s*```\s*$/,"").trim();
  try{return JSON.parse(cleaned)}catch{}
  const match=cleaned.match(/\{[\s\S]*\}/);
  if(match){try{return JSON.parse(match[0])}catch{}}
  return null;
}
function findItems(value,depth=0){
  if(!value||depth>5)return [];
  if(Array.isArray(value)){
    if(value.length && value.some(x=>x&&typeof x==="object"&&(
      x.description||x.serviceName||x.service||x.name||x.catalogueItem||x.item
    )))return value;
    for(const x of value){const found=findItems(x,depth+1);if(found.length)return found;}
    return [];
  }
  if(typeof value!=="object")return [];
  const keys=["items","lineItems","line_items","services","selectedServices","selected_services","quote","quotation","proposal","result","data","output"];
  for(const key of keys){
    if(value[key]!==undefined){
      const found=findItems(value[key],depth+1);
      if(found.length)return found;
    }
  }
  return [];
}
function normalizeItems(quote,catalogue){
  const generated=findItems(quote);
  if(!generated.length)return [];
  const allowed=new Map(catalogue.map(x=>[String(x.name||"").trim().toLowerCase(),Number(x.price)]));
  return generated.map(item=>{
    const nested=item.catalogueItem||item.item||item;
    const description=String(nested.description||nested.serviceName||nested.service_name||nested.service||nested.name||nested.title||"").trim();
    const key=description.toLowerCase();
    if(!allowed.has(key))throw new Error("SERV suggested a service outside your approved catalogue: "+(description||"unnamed item")+". No quotation was created.");
    const quantity=Math.max(1,Math.min(1000,Number(nested.quantity??nested.qty)||1));
    return {description,detail:String(nested.detail||nested.details||nested.scope||nested.descriptionOfWork||""),quantity,price:allowed.get(key)};
  });
}
async function complete(auth,model,messages){
  const response=await fetch(SERV_BASE+"/chat/completions",{
    method:"POST",
    headers:{...auth,"Content-Type":"application/json"},
    body:JSON.stringify({model,messages,temperature:0.1,max_tokens:1800})
  });
  const body=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(body.error?.message||"SERV generation failed ("+response.status+").");
  const raw=extractText(body);
  if(!raw)throw new Error("SERV returned an empty response.");
  const parsed=parseObject(raw);
  if(!parsed)throw new Error("SERV returned text that could not be read as a quotation. Please retry.");
  return {raw,parsed};
}

export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  if(!process.env.SERV_REASONING_API_KEY)return res.status(503).json({error:"SERV_REASONING_API_KEY is missing from Vercel Production environment variables."});
  try{
    const {request,profile,catalogue,customer,quoteContext={}}=req.body||{};
    if(typeof request!=="string"||!request.trim())return res.status(400).json({error:"Add the customer's request first."});
    if(!Array.isArray(catalogue)||!catalogue.length)return res.status(400).json({error:"Add at least one service to your business catalogue."});
    const auth={Authorization:"Bearer "+process.env.SERV_REASONING_API_KEY};
    let discoveredModel="";
    try{
      const modelsRes=await fetch(SERV_BASE+"/models",{headers:auth});
      if(modelsRes.ok){
        const modelsData=await modelsRes.json();
        const models=Array.isArray(modelsData.items)?modelsData.items:Array.isArray(modelsData.data)?modelsData.data:Array.isArray(modelsData.models)?modelsData.models:[];
        discoveredModel=models.find(x=>x.modelId==="claude-haiku-4.5")?.modelId||models[0]?.modelId||models[0]?.id||"";
      }
    }catch(discoveryError){console.warn("SERV model discovery unavailable; using verified fallback:",discoveryError.message);}
    const model=(process.env.SERV_REASONING_MODEL||"").trim()||discoveredModel||"claude-haiku-4.5";
    const catalogueForPrompt=catalogue.map((x,index)=>({catalogueId:index+1,name:x.name,description:x.description,unitPriceUSD:Number(x.price)}));
    const user={customer,request,approvedBusinessCatalogue:catalogueForPrompt,businessRules:{businessName:profile?.name,currency:"USD",taxRate:Number(profile?.taxRate)||0,paymentTerms:profile?.terms},existingDocument:quoteContext};
    const system=`You are the quotation specialist for a real business. Return one JSON object only, with this exact shape:
{"title":"Quotation title","notes":"Short scope summary","items":[{"description":"EXACT catalogue service name copied character-for-character","detail":"What this service includes for this customer","quantity":1}],"exclusions":[],"assumptions":[]}
Rules:
1. Select the relevant services from approvedBusinessCatalogue. If the request clearly asks for work covered by a catalogue service, you MUST include that service in items.
2. At least one item is required whenever at least one catalogue service matches the request.
3. The description must exactly equal a catalogue service name. Do not invent or rename services.
4. Never output prices. The application inserts and validates the approved USD prices.
5. Do not return an empty items array when a relevant catalogue service exists.
6. Work not covered by the catalogue goes in exclusions as "Needs manual scoping".
7. Use quantity 1 unless the customer explicitly specifies a quantity.
8. No markdown fences, commentary, or extra text.`;
    const first=await complete(auth,model,[{role:"system",content:system},{role:"user",content:JSON.stringify(user)}]);
    let quote=first.parsed;
    let items=normalizeItems(quote,catalogue);
    if(!items.length){
      // One focused repair pass handles models that return a summary but omit the required line items.
      const repair=`Your previous response did not include any recognizable quotation line items. Re-read the original request and catalogue below. Return the required JSON object again. This time include every relevant catalogue service in the "items" array. Each item must have "description" exactly equal to one catalogue "name", plus "detail" and "quantity". Do not explain your reasoning. Do not return an empty array if a service matches.\n\nOriginal input:\n${JSON.stringify(user)}\n\nYour previous response:\n${first.raw.slice(0,5000)}`;
      const second=await complete(auth,model,[{role:"system",content:system},{role:"user",content:repair}]);
      quote=second.parsed;
      items=normalizeItems(quote,catalogue);
    }
    if(!items.length)throw new Error("SERV could not identify a matching service in your catalogue. Check that the service names and descriptions match the customer's request, then retry.");
    quote.items=items;
    quote.notes=[quote.notes||"",...(Array.isArray(quote.assumptions)&&quote.assumptions.length?["Assumptions: "+quote.assumptions.join("; ")]:[]),...(Array.isArray(quote.exclusions)&&quote.exclusions.length?["Needs manual scoping: "+quote.exclusions.join("; ")]:[]),profile?.terms||""].filter(Boolean).join("\n\n");
    return res.status(200).json({quote,model});
  }catch(error){console.error("SERV generation error:",error);return res.status(502).json({error:error.message||"SERV generation failed."});}
}