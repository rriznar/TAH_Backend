import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connect from "./db.js";
import auth from "./auth.js";
const BSON = require('bson');


const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.get("/posts/:id", async(req,res)=>{
    let id = req.params.id;
    let db = await connect();

    let doc = await db.collection("posts").findOne({_id: new BSON.ObjectId(id)})
    console.log(doc);
    res.json(doc);
})


app.get("/posts", async(req,res)=>{
    let db = await connect()
    let query = req.query;

    let selekcija = {}

    if (query.title){
        selekcija.title = new RegExp(query.title)
    }

    if(query._any){
        let pretraga = query._any
        let terms = pretraga.split(" ")

        let atributi = ["title", "text", "photo"]
    
        selekcija = {
            $and: []
        }
    terms.forEach(term => {
        let or = {
            $or: []
        }
    
        atributi.forEach(atribut =>{
            or.$or.push({ [atribut]: new RegExp(term)})
        })

        selekcija.$and.push(or)
    }) 
    }

    console.log("Selekcija", selekcija)

    let cursor = await db.collection("posts").find(selekcija)
    let results = await cursor.toArray()

    res.json(results)
})

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

app.post ('/BMI', async (req , res) => {
    let db = await connect();
    let BMI = req.body;
    console.log(BMI);
    /*let kvadrat_visine = BPI.visina*BPI.visina;
    let BPI_zbroj = BPI.broj/kvadrat_visine
    BPI = BPI_zbroj;*/
    //let final = JSON.stringify({BPI})
    //console.log(final)
    //let random =(Math.round(Math.random()*1000))/100;
    //BPI._id = random;
    
    let result = await db.collection('BMI').insertOne(BMI);
    console.log("Evo rezultata: ",result);
    if (result.insertedCount == 1) {
        res.send({
            status: 'success',
            id: result.insertedId,
        });
    } 
    else {
        res.send({
            status: 'fail',
        });
    }
    
    console.log(result);
});

app.get ('/raspored', async (req , res) => {
    let db = await connect();
    let cursor = await db.collection('raspored').find({});
    let results = await cursor.toArray();

    res.send(results);
});

app.get("/BMI", async(req,res)=>{
    let db = await connect();
    let cursor = await db.collection('BMI').find({});
    let results = await cursor.toArray();

    res.send(results);
})

app.get("/BMI/:id", async(req,res)=>{
    let id = req.params.id;
    console.log("id: ",id);

    let db = await connect();

    let doc = await db.collection("BMI").findOne({_id: new BSON.ObjectId(id)})
    console.log(doc);
    res.json(doc);
})

app.listen(port, ()=> console.log(`Slusam na portu ${port}!`));