export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const key=process.env.REPPO_API_KEY||"";
 const result={configured:key.trim().length>0};
 if(!result.configured)return res.status(503).json(result);
 try{
  const r=await fetch("https://eval.reppo.xyz/api/v1/agents/eval-requests/pending",{headers:{Authorization:"Bearer "+key,Accept:"application/json"}});
  const body=await r.text();
  result.pendingHttpStatus=r.status;
  result.authAccepted=r.status!==401&&r.status!==403;
  result.bodyPreview=body.slice(0,1000);
  return res.status(200).json(result);
 }catch(e){return res.status(502).json({configured:true,error:e.message});}
}