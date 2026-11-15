export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const key=process.env.REPPO_API_KEY||"";
 const result={configured:key.trim().length>0};
 if(!result.configured)return res.status(503).json(result);
 try{
  const docs=await fetch("https://eval.reppo.xyz/agents.md");
  result.agentsMdStatus=docs.status;
  result.agentsMdPreview=(await docs.text()).slice(0,7000);
  const submit=await fetch("https://eval.reppo.xyz/api/v1/agents/eval-requests/submit",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({type:"answer",payload:"Scope & Sum one-time API connectivity test. Please assess whether this short service quotation workflow description is clear and complete.",context:"A one-time integration test by the application owner. This is not a customer quotation. Evaluate clarity only.",settlementMinutes:10})});
  const body=await submit.text();
  result.submitHttpStatus=submit.status;
  result.submitContentType=submit.headers.get("content-type");
  result.submitResponse=body.slice(0,2500);
  try{const j=JSON.parse(body);result.evalId=j.evalId||j.id||j.evaluationId||j.requestId||j.data?.evalId||j.data?.id||null;}catch{}
  return res.status(200).json(result);
 }catch(e){return res.status(502).json({configured:true,error:e.message});}
}