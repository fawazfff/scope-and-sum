export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const key=process.env.SERV_REASONING_API_KEY;
 if(!key)return res.status(503).json({configured:false});
 const model=(process.env.SERV_REASONING_MODEL||"").trim()||"claude-haiku-4.5";
 const system=`You are the quotation specialist for a real business. Produce a clear, accurate quotation draft as JSON only. You MUST only select services present in the supplied catalogue. Never invent services, prices, discounts, taxes, delivery dates, guarantees or terms. Use exact catalogue unit prices. If the request asks for something not in the catalogue, do not price it; list it in exclusions as "Needs manual scoping". Quantity may be inferred only when explicitly clear from the customer request. Otherwise use 1 and explain the assumption in notes. Keep descriptions concise and specific. Currency is USD. Return this exact JSON shape: {"title":"...","notes":"...","items":[{"description":"exact catalogue service name","detail":"scope detail","quantity":1,"price":0}],"exclusions":["..."],"assumptions":["..."]}. No markdown fences.`;
 const user={customer:{name:"Demo Coffee Shop"},request:"We need exactly one Brand identity direction service, including a concept, visual direction and logo suite. Please quote this one service.",approvedBusinessCatalogue:[{name:"Brand identity direction",description:"Concept, visual direction and logo suite",unitPrice:1200}],businessRules:{businessName:"Scope & Sum Test Studio",currency:"USD",taxRate:0,paymentTerms:"50% deposit to begin."}};
 try{
  const r=await fetch("https://inference-api.openserv.ai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model,messages:[{role:"system",content:system},{role:"user",content:JSON.stringify(user)}],temperature:0.2})});
  const body=await r.json().catch(()=>({}));
  return res.status(200).json({configured:true,model,httpStatus:r.status,finishReason:body.choices?.[0]?.finish_reason,content:body.choices?.[0]?.message?.content,usage:body.usage,error:body.error||null});
 }catch(e){return res.status(502).json({configured:true,model,error:e.message});}
}