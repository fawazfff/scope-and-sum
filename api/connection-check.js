const SERV_BASE="https://inference-api.openserv.ai/v1";
const REPPO_SUBMIT="https://eval.reppo.xyz/api/v1/agents/eval-requests/submit";
export default async function handler(req,res){
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const checks={serv:{configured:Boolean(process.env.SERV_REASONING_API_KEY)},reppo:{configured:Boolean(process.env.REPPO_API_KEY)}};
  if(checks.serv.configured){
    try{
      const r=await fetch(SERV_BASE+"/models",{headers:{Authorization:"Bearer "+process.env.SERV_REASONING_API_KEY}});
      const body=await r.json().catch(()=>({}));
      checks.serv.modelsHttpStatus=r.status;
      checks.serv.authenticated=r.ok;
      checks.serv.responseKeys=Object.keys(body||{});
      checks.serv.responsePreview=JSON.stringify(body).slice(0,1800);
      const models=Array.isArray(body.data)?body.data:Array.isArray(body.models)?body.models:Array.isArray(body.items)?body.items:Array.isArray(body.data?.models)?body.data.models:[];
      checks.serv.availableModelIds=models.map(x=>x.id||x.name).filter(Boolean).slice(0,8);
      if(!r.ok)checks.serv.error=body.error?.message||body.message||"SERV rejected model discovery.";
      else if(checks.serv.availableModelIds.length){
        const model=process.env.SERV_REASONING_MODEL||checks.serv.availableModelIds[0];
        const completion=await fetch(SERV_BASE+"/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+process.env.SERV_REASONING_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model,messages:[{role:"user",content:"Reply with exactly: connection successful"}],temperature:0,max_tokens:24})});
        const result=await completion.json().catch(()=>({}));
        checks.serv.completionHttpStatus=completion.status;
        checks.serv.completionSuccessful=completion.ok&&Boolean(result.choices?.[0]?.message?.content);
        checks.serv.modelUsed=model;
        checks.serv.replyReceived=Boolean(result.choices?.[0]?.message?.content);
        if(!completion.ok)checks.serv.completionError=result.error?.message||result.message||JSON.stringify(result).slice(0,500);
      } else checks.serv.note="Model discovery returned no recognizable model IDs.";
    }catch(e){checks.serv.error=e.message||"SERV connection failed.";}
  }
  if(checks.reppo.configured){
    try{
      const r=await fetch(REPPO_SUBMIT,{method:"POST",headers:{Authorization:"Bearer "+process.env.REPPO_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({type:"answer",payload:"Connection test for Scope & Sum. Please assess whether this short test submission is coherent.",context:"This is a one-time live API connectivity test initiated by the application owner. It is not a customer quotation.",settlementMinutes:10})});
      const body=await r.json().catch(()=>({}));
      checks.reppo.submitHttpStatus=r.status;
      checks.reppo.authenticated=r.status!==401&&r.status!==403;
      checks.reppo.submissionAccepted=r.ok;
      if(r.ok)checks.reppo.evalId=body.evalId||body.id||body.evaluationId||body.requestId||body.data?.evalId||body.data?.id||null;
      else checks.reppo.error=body.message||body.error||JSON.stringify(body).slice(0,700);
    }catch(e){checks.reppo.error=e.message||"Reppo connection failed.";}
  }
  const ok=checks.serv.completionSuccessful===true&&checks.reppo.submissionAccepted===true;
  return res.status(ok?200:502).json({ok,checks});
}