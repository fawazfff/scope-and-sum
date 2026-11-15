const BASE="https://eval.reppo.xyz/api/v1";
export default async function handler(req,res){
  const apiKey=process.env.REPPO_API_KEY;
  if(!apiKey)return res.status(503).json({error:"REPPO_API_KEY is missing from Vercel Production environment variables."});
  if(req.method==="POST"){
    try{
      const {business,request,quote}=req.body||{};
      if(typeof request!=="string"||!request.trim())return res.status(400).json({error:"The original customer request is required."});
      if(!quote||!Array.isArray(quote.items)||!quote.items.length)return res.status(400).json({error:"Create a quotation before requesting a review."});
      if(!Array.isArray(business?.catalogue)||!business.catalogue.length)return res.status(400).json({error:"Business catalogue is required for price verification."});
      const approved=new Map(business.catalogue.map(item=>[String(item.name||"").trim().toLowerCase(),Number(item.price)]));
      for(const item of quote.items){
        const key=String(item.description||"").trim().toLowerCase();
        if(!approved.has(key))return res.status(400).json({error:"A quotation line is not in the approved business catalogue: "+String(item.description||"Unnamed item")});
        if(Number(item.price)!==approved.get(key))return res.status(400).json({error:"A quotation rate does not match the approved catalogue price for "+item.description+"."});
        if(!Number.isFinite(Number(item.quantity))||Number(item.quantity)<=0)return res.status(400).json({error:"Every quotation quantity must be greater than zero."});
      }
      const subtotal=quote.items.reduce((sum,item)=>sum+Number(item.quantity)*Number(item.price),0);
      const tax=subtotal*(Math.max(0,Number(business.taxRate)||0)/100);
      const safeBusiness={name:String(business.name||"").slice(0,160),currency:"USD",taxRate:Math.max(0,Number(business.taxRate)||0),paymentTerms:String(business.terms||"").slice(0,1000)};
      const evaluationInput=[
        "SCOPE & SUM QUOTATION QUALITY REVIEW",
        "Review the proposed quotation independently. Compare it with the original customer request and approved business catalogue.",
        "Assess whether the quotation covers the requested work, describes deliverables clearly, identifies gaps and assumptions, uses only approved catalogue services, applies exact catalogue rates, and calculates totals correctly. Do not invent facts. State specific issues and practical corrections.",
        "BUSINESS RULES: "+JSON.stringify(safeBusiness),
        "ORIGINAL CUSTOMER REQUEST: "+request.slice(0,12000),
        "APPROVED SERVICE CATALOGUE: "+JSON.stringify(business.catalogue.map(x=>({service:x.name,description:x.description,approvedUnitPriceUSD:Number(x.price)}))),
        "PROPOSED QUOTATION: "+JSON.stringify({title:quote.title,notes:quote.notes,items:quote.items.map(x=>({service:x.description,scope:x.detail,quantity:Number(x.quantity),unitPriceUSD:Number(x.price),lineTotalUSD:Number(x.quantity)*Number(x.price)})),subtotalUSD:subtotal,taxUSD:tax,totalUSD:subtotal+tax,currency:"USD"})
      ].join("\n\n");
      if(new TextEncoder().encode(evaluationInput).length>50*1024)return res.status(400).json({error:"The quotation is too large for Reppo's 50 KB input limit. Shorten the request or service descriptions."});
      const upstream=await fetch(BASE+"/agents/evals",{method:"POST",headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({taskType:"response",input:evaluationInput})});
      const raw=await upstream.text();
      let data={};try{data=JSON.parse(raw)}catch{}
      if(!upstream.ok){
        const message=data.error||data.message||raw.slice(0,500)||"Reppo rejected the evaluation request.";
        const hint=upstream.status===401||upstream.status===403?" Check that REPPO_API_KEY was generated in the Evaluation Console.":upstream.status===402?" Reppo reports insufficient evaluation credits.":"";
        return res.status(upstream.status).json({error:"Reppo API returned "+upstream.status+": "+message+hint});
      }
      const id=data.id||data.evalId||data.evaluationId;
      if(!id)return res.status(502).json({error:"Reppo accepted the request but returned no evaluation ID.",details:data});
      return res.status(200).json({evalId:String(id),status:data.status||"QUEUED"});
    }catch(error){console.error("Reppo submit error:",error);return res.status(502).json({error:error.message||"Could not submit evaluation."});}
  }
  if(req.method==="GET"){
    const id=String(req.query?.id||"").trim();
    if(!id||!/^[a-zA-Z0-9._:-]{1,200}$/.test(id))return res.status(400).json({error:"A valid evaluation ID is required."});
    try{
      const upstream=await fetch(BASE+"/agents/evals/"+encodeURIComponent(id),{headers:{Authorization:"Bearer "+apiKey,Accept:"application/json"}});
      const raw=await upstream.text();let data={};try{data=JSON.parse(raw)}catch{}
      if(!upstream.ok)return res.status(upstream.status).json({error:data.error||data.message||raw.slice(0,500)||"Could not retrieve Reppo evaluation."});
      const result=data.result||{};
      const rubric=result.rubric_scores||{};
      const verdicts=Object.entries(rubric).map(([dimension,score])=>({dimension,score,critique:"Independent evaluator score"}));
      const evaluators=Array.isArray(result.consensus?.evaluators)?result.consensus.evaluators:[];
      return res.status(200).json({
        status:data.status||"UNKNOWN",
        message:result.reason||data.message||"",
        verdict:data.status==="COMPLETED"?{score:data.score??result.score??null,decision:result.decision||"review",confidence:result.confidence||"unknown",reason:result.reason||""}:null,
        action:data.route?{route:data.route}:null,
        verdicts,
        peerAssessmentCount:evaluators.length||null,
        evidence:result.consensus||null,
        creditsCharged:data.creditsCharged??null,
        completedAt:data.completedAt||null
      });
    }catch(error){console.error("Reppo poll error:",error);return res.status(502).json({error:error.message||"Could not retrieve evaluation."});}
  }
  return res.status(405).json({error:"Method not allowed"});
}