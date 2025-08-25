const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://bisnuchandraroy10:RDa3je9PlC9ulAcQ@cluster0.e1cygwf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Alldata");
    const collection = database.collection("users");
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.post("/myplants", async(req, res)=>{
      const data = req.body;
      const result = await collection.insertOne(data);
      res.send(result);
    })

    app.get("/myplants", async(req, res)=>{
      const result =await collection.find().toArray();
      res.send(result);
    })

    app.get("/myplants/:id", async(req, res)=>{
      const id = req.params.id;
      const result = await collection.findOne({
        _id : new ObjectId(id)
      })
      res.send(result);
    })

    app.put("/myplants/:id", async(req, res)=>{
      const id = req.params.id;
      const data = req.body;
      const filter = {_id : new ObjectId(id)}
      const update = {$set : data};
      const result = await collection.updateOne(filter, update);
      res.send(result)
    })

    app.delete("/myplants/:id", async(req, res)=>{
      const id = req.params.id;
      const result = await collection.deleteOne({
        _id : new ObjectId(id)
      })
      res.send(result);
    })
  } finally {
 
  }
}
run().catch(console.dir);

app.get("/", (req, res)=>{
res.send("Your server is completely ready to run.")
});

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
 })

