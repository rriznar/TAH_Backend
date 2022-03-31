import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connect from "./db.js";
import auth from "./auth.js";


const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.get("/tajna", [auth.verify], (req,res)=>{
   
    res.json({message:"Ovo je tajna " + req.jwt.username});
})

app.post("/auth", async (req,res)=>{
    let user = req.body;

    try{
        let result = await auth.authenticateUser(user.username, user.password)
        res.json(result);
    }
    catch(e){
        res.status(401).json({error:e.message});
    }
    
})

app.post("/users", async (req,res)=>{
    let user = req.body;

    let id;
    try{
    id = auth.registerUser(user);
    }
    catch(e){
        res.status(500).json({error:e.message});
    }
    res.json({id:id});
    
})

app.get("/", (req,res)=>{
    res.send("Hello world u browser")
    console.log("Hello world u konzolu")
})

app.listen(port, ()=> console.log(`Slusam na portu ${port}!`));