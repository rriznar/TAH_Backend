const {MongoClient} = require("mongodb");

let connection_string ="mongodb+srv://rikii:admin@cluster0.nvyg7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let client = new MongoClient(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let db = null;

export default () =>{
    return new Promise((resolve, reject)=>{

        if(db){
            resolve(db)
        }

        client.connect(err=>{
            if(err){
                reject("Doslo je do greske prilikom spajanja" + err)
            }
            else{
                console.log("Uspjesno spajanje na bazu")
                db = client.db("TAH")
                resolve(db)
            }
        })
    })
}
