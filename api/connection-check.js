const SERV_BASE="https://inference-api.openserv.ai/v1";
const REPPO_BASE="https://eval.reppo.xyz/api/v1/agents/eval-requests";
export default async function handler(req,res){
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const checks={serv:{configured:Boolean(process.env.SERV_REASONING_API_KEY)},reppo:{configured:Boolean(process.env.REPPO_API_KEY)}};
  if(checks.serv.configured){
    try{
      const r=await fetch(SERV_BASE+"/models",{headers:{Authorization:"Bearer "+process.env.SERV_REASONING_API_KEY}});
      const body=await r.json().catch(()=>({}));
      checks.serv.modelsHttpStatus=r.status;
      checks.serv.authenticated=r.ok;
      const models=Array.isArray(body.data)?body.data:Array.isArray(body.models)?body.models:Array.isArray(body.items)?body.items:[];
      checks.serv.availableModelIds=models.map(x=>x.id||x.name).filter(Boolean).slice(0,8);
      if(!r.ok)checks.serv.error=body.error?.message||body.message||"SERV rejected model discovery.";
      else if(checks.serv.availableModelIds.length){
        const model=checks.serv.availableModelIds[0];
        const completion=await fetch(SERV_BASE+"/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+process.env.SERV_REASONING_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model,messages:[{role:"user",content:"Reply with exactly: connection successful"}],temperature:0})});
        const result=await completion.json().catch(()=>({}));
        checks.serv.completionHttpStatus=completion.status;
        checks.serv.completionSuccessful=completion.ok&&Boolean(result.choices?.[0]?.message?.content);
        if(!completion.ok)checks.serv.completionError=result.error?.message||result.message||"SERV completion request failed.";
        else checks.serv.replyReceived=Boolean(result.choices?.[0]?.message?.content);
      } else checks.serv.note="Authentication succeeded, but the model-list response contained no recognized model array.";
    }catch(e){checks.serv.error=e.message||"SERV connection failed.";}
  }
  if(checks.reppo.configured){
    try{
      const r=await fetch(REPPO_BASE+"/submit",{method:"POST",headers:{Authorization:"Bearer "+process.env.REPPO_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({})});
      const body=await r.json().catch(()=>({}));
      checks.reppo.submitEndpointHttpStatus=r.status;
      checks.reppo.authenticated=r.status!==401&&r.status!==403;
      checks.reppo.endpointResponded=r.status!==404&&r.status!==405;
      checks.reppo.validationResponse=body.message||body.error||"";
      checks.reppo.note="Sent an empty validation request only. No evaluation was created.";
    }catch(e){checks.reppo.error=e.message||"Reppo connection failed.";}
  }
  const ok=checks.serv.completionSuccessful===true&&checks.reppo.authenticated===true&&checks.reppo.endpointResponded===true;
  return res.status(ok?200:502).json({ok,checks});
}