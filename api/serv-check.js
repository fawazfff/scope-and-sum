import generate from "./generate.js";
export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const mockReq={method:"POST",body:{request:"We need exactly one Brand identity direction service, including a concept, visual direction and logo suite. Please quote this one service.",profile:{name:"Scope & Sum Test Studio",currency:"USD",taxRate:0,terms:"50% deposit to begin."},catalogue:[{id:1,name:"Brand identity direction",description:"Concept, visual direction and logo suite",price:1200}],customer:{name:"Demo Coffee Shop"},quoteContext:{}}};
 let status=200;
 const mockRes={status(code){status=code;return this;},json(data){return res.status(status).json({httpStatus:status,...data});}};
 return generate(mockReq,mockRes);
}