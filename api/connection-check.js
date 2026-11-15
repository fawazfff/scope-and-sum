const SERV_BASE="https://inference-api.openserv.ai/v1";
const REPPO_BASE="https://eval.reppo.xyz/api/v1/agents/eval-requests";
export default async function handler(req,res){
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const results={serv:{configured:Boolean(process.env.SERV_REASONING_API_KEY)},reppo:{configured:Boolean(process.env.REPPO_API_KEY)}};
  if(results.serv.configured){
    try{
      const r=await fetch(SERV_BASE+"/models",{headers:{Authorization:"Bearer "+process.env.SERV_REASONING_API_KEY}});
      const body=await r.json().catch(()=>({}));
      results.serv.httpStatus=r.status;
      results.serv.authenticated=r.ok;
      results.serv.modelCount=Array.isArray(body.data)?body.data.length:0;
      if(!r.ok)results.serv.error=body.error?.message||body.message||"SERV rejected the request.";
    }catch(e){results.serv.error=e.message||"SERV connection failed.";}
  }
  if(results.reppo.configured){
    try{
      const r=await fetch(REPPO_BASE+"/pending",{headers:{Authorization:"Bearer "+process.env.REPPO_API_KEY}});
      const body=await r.json().catch(()=>({}));
      results.reppo.httpStatus=r.status;
      results.reppo.authenticated=r.ok;
      if(!r.ok)results.reppo.error=body.message||body.error||"Reppo rejected the request.";
    }catch(e){results.reppo.error=e.message||"Reppo connection failed.";}
  }
  const ok=results.serv.authenticated===true&&results.reppo.authenticated===true;
  return res.status(ok?200:502).json({ok,checks:results});
}