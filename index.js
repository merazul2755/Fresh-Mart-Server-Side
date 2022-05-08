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
        const orderCollection = client.db('products').collection('order');

        //Show All Product
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

        //Add Product
        app.post('/items', async (req,res)=>{
          const newProduct = req.body; 
          const result = productCollection.insertOne(newProduct);
          res.send(result);
        });

        //Update Quantity
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

        //Delete
        app.delete('/items/:id', async (req,res)=>{
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const result = await productCollection.deleteOne(query);
          res.send(result);

        });

        //order get
        app.get('/order', async (req,res)=>{
          const email = req.query.email;
          const query = {email: email};
          const cursour = orderCollection.find(query);
          const item = await cursour.toArray();
          res.send(item);
        });

        //Order
        app.post('/order', async(req,res)=>{
          const order = req.body;
          const result =await orderCollection.insertOne(order);
          res.send(result);
        })
        //Delete order
        app.delete('/order/:id', async (req,res)=>{
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const result = await orderCollection.deleteOne(query);
          res.send(result);

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
