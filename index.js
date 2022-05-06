const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_PRODUCT}:${process.env.DB_PASS}@cluster0.ukdn9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run(){
    try{
        await client.connect();
        const productCollection = client.db('products').collection('item');

        app.get('/items', async (req,res)=>{
          const query = {};
          const cursour = productCollection.find(query);
          const items = await cursour.toArray();
          res.send(items);
        });

        app.get('/items/:id', async (req,res)=>{
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const item = await productCollection.findOne(query);
          res.send(item);

        });

        app.put('/items/:id', async(req,res)=>{
          const id = req.params.id;
          const updateItem = req.body;
          const filter = {_id : ObjectId(id)};
          const option = {upsert : true};
          const updateDoc = {
            $set : updateItem
          };
          const result = await productCollection.updateOne(filter, updateDoc, option);
          res.send(result)

        });



    }finally{

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Running server");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
