const BASE="https://eval.reppo.xyz/api/v1/agents/eval-requests";
export default async function handler(req,res){
  if(!process.env.REPPO_API_KEY)return res.status(503).json({error:"REPPO_API_KEY is missing from Vercel Production environment variables."});
  if(req.method==="POST"){
    try{
      const {business,customer,request,quote}=req.body||{};
      if(!quote||!Array.isArray(quote.items)||!quote.items.length)return res.status(400).json({error:"Create a quotation before requesting a review."});
      const context={purpose:"Independent quality review of a business quotation drafted by an AI assistant.",business,customer,originalCustomerRequest:request,reviewInstructions:"Judge whether the quotation accurately and completely addresses the customer's request, uses the supplied business rules and prices, has clear deliverables, sensible quantities, correct arithmetic, and avoids unsupported promises or invented scope. Treat the supplied business catalogue and business rules as authoritative. Check arithmetic independently. Flag missing work, ambiguous scope, pricing mismatches, unsupported assumptions, and unclear terms. Do not provide legal or tax certification."};
      const payload={type:"artifact",payload:JSON.stringify(quote),context:JSON.stringify(context),settlementMinutes:10};
      const upstream=await fetch(BASE+"/submit",{method:"POST",headers:{Authorization:"Bearer "+process.env.REPPO_API_KEY,"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await upstream.json();
      if(!upstream.ok)return res.status(upstream.status).json({error:data.message||data.error||"Reppo rejected the evaluation request.",details:data});
      const id=data.evalId||data.id||data.evaluationId||data.requestId||data.data?.evalId||data.data?.id;
      if(!id)return res.status(502).json({error:"Reppo accepted the request but did not return a recognizable evaluation ID.",response:data});
      return res.status(200).json({evalId:String(id),status:data.status||"submitted"});
    }catch(error){console.error("Reppo submit error:",error);return res.status(502).json({error:error.message||"Could not submit evaluation."});}
  }
  if(req.method==="GET"){
    const id=String(req.query?.id||"").trim();
    if(!id||!/^[a-zA-Z0-9_-]{4,200}$/.test(id))return res.status(400).json({error:"A valid evaluation ID is required."});
    try{
      const upstream=await fetch(BASE+"/"+encodeURIComponent(id),{headers:{Authorization:"Bearer "+process.env.REPPO_API_KEY}});
      const data=await upstream.json();
      if(!upstream.ok)return res.status(upstream.status).json({error:data.message||data.error||"Could not retrieve Reppo evaluation."});
      const root=data.data||data.evaluation||data;
      return res.status(200).json({status:root.status||root.state||"pending",message:root.message||root.statusMessage||"",verdict:root.verdict||data.verdict||null,action:root.action||data.action||null,verdicts:root.verdicts||data.verdicts||[],peerAssessmentCount:root.peerAssessmentCount??data.peerAssessmentCount??null,evidence:root.evidence||data.evidence||null,raw:root.status?undefined:data});
    }catch(error){console.error("Reppo poll error:",error);return res.status(502).json({error:error.message||"Could not retrieve evaluation."});}
  }
  return res.status(405).json({error:"Method not allowed"});
}