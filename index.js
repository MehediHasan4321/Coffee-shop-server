const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// Medalware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env._USER_NAME}:${process.env._USER_PASSWORD}@cluster0.mzevrg2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    app.get('/coffees', async (req, res) => {
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const quire = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(quire)
      res.send(result)
    })

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const quire = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(quire)
      res.send(result)
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updateCoffee = req.body
      const coffee = {
        $set: {
          coffeeName: updateCoffee.chefName,
          chefName: updateCoffee.chefName,
          supplyerName: updateCoffee.supplyerName,
          test: updateCoffee.test,
          category: updateCoffee.category,
          details: updateCoffee.details,
          url: updateCoffee.url
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, option)
      res.send(result)

    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Coffee Shop Server is Running')
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})