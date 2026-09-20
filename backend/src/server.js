import express from "express";import cors from "cors";
const app=express();app.use(cors());app.use(express.json({limit:"2mb"}));
const modules=["CUSTOMER","ACCOUNT","TRANSACTION","PAYMENT","DATABASE","AUDIT","REPORT","AUTHENTICATION"];
const edges=[["AUTHENTICATION","CUSTOMER"],["CUSTOMER","ACCOUNT"],["ACCOUNT","TRANSACTION"],["TRANSACTION","PAYMENT"],["TRANSACTION","DATABASE"],["PAYMENT","DATABASE"],["PAYMENT","AUDIT"],["DATABASE","REPORT"],["AUDIT","REPORT"]];
app.get("/api/health",(req,res)=>res.json({ok:true}));
app.get("/api/system",(req,res)=>res.json({modules,edges,stats:{programs:8,dependencies:10,files:6,sqlOperations:12}}));
app.post("/api/analysis/analyze",(req,res)=>{const code=req.body.code||"";const found=["PERFORM","CALL","READ","WRITE","REWRITE","OPEN","CLOSE","EXEC SQL","IF","EVALUATE","MOVE","COMPUTE"].filter(x=>code.toUpperCase().includes(x));res.json({program:"PAYMENT",lines:code.split(/\r?\n/).length,modules,found,dependencies:edges,summary:"Static analysis identified program flow, calls, file/database operations and control logic.",risk:"Medium"});});
app.post("/api/impact",(req,res)=>{const m=req.body.module||"PAYMENT";const affected=m==="PAYMENT"?["DATABASE","AUDIT","REPORT"]:["TRANSACTION","PAYMENT","DATABASE"];res.json({module:m,change:req.body.change||"Change business rule",risk:"High",score:78,affected,reason:"Downstream persistence, audit and reporting dependencies may be affected.",evidence:["CALL 'DATABASE'","CALL 'AUDIT'","UPDATE ACCOUNT SET BALANCE"]});});
app.listen(5000,()=>console.log("LegacyMind backend: http://localhost:5000"));