export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const key=process.env.REPPO_API_KEY||"";
 const result={configured:key.trim().length>0};
 if(!result.configured)return res.status(503).json(result);
 try{
  const docs=await fetch("https://eval.reppo.xyz/agents.md");
  result.currentAgentsDocStatus=docs.status;
  const doc=await docs.text();
  result.docConfirmsNewEndpoint=doc.includes("POST /agents/evals")||doc.includes("/agents/evals");
  result.docPreview=doc.slice(0,1200);
  const input="Scope & Sum connectivity test. Review this short proposed quotation workflow for clarity and completeness: a design studio receives a request for brand identity, prepares a scope from its approved catalogue, validates prices, and sends the quotation for review. This is a one-time integration test, not a customer quote. Give a concise quality assessment.";
  const submit=await fetch("https://eval.reppo.xyz/api/v1/agents/evals",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({taskType:"response",input})});
  const raw=await submit.text();let body={};try{body=JSON.parse(raw)}catch{}
  result.submitHttpStatus=submit.status;
  result.submitResponse=body;
  result.responsePreview=raw.slice(0,900);
  return res.status(200).json(result);
 }catch(e){return res.status(502).json({configured:true,error:e.message});}
}