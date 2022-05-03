const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://Fresh-Mart:Ch3vlSvypC1UyscV@cluster0.ukdn9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("fresh-mart").collection("users");
  console.log('db connected')
  // perform actions on the collection object
  client.close();
});


app.get('/', (req, res) =>{
    res.send('Running server');
});

app.listen(port, ()=>{
    console.log('Listening to port', port);
});