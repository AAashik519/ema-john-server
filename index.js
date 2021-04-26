const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wrj66.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 8000

app.use(bodyParser.json())
app.use(cors())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProducts', (req, res) => {
    const product = req.body;
    productCollection.insertONE(product)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
  })
  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/products/:key', (req, res) => {
    productCollection.find({key:req.params.key})
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })
  app.post('/productsByKeys',(req,res) => {
    const productKeys = req.body;
    productCollection.find({key:{$in:productKeys}})
    .toArray( ( err , documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const  order = req.body;
     ordersCollection.insertONE(product)
      .then(result => { 
        res.send(result.insertedCount  )
      })
  })



});
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})