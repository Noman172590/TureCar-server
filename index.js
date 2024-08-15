const express = require('express')
const cors = require('cors')
require('dotenv').config();

const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to trueCar server')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.c60ctk1.mongodb.net/?retryWrites=true&w=majority`;


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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productsCollection = client.db('products').collection('product');
    const usersCollection = client.db('Truecarusersdb').collection('Truecarusers');
    const mycartCollection = client.db('myCart').collection('cartProducts')

    
    app.get('/products',async (req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })

  
    app.get('/users',async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result)
    })


    app.get('/mycart', async (req, res) => {
      const result = await mycartCollection.find().toArray();
      res.send(result)
    })

    app.get('/mycart/:email', async (req,res) => {
      const useremail = req.params.email;
      const result = await mycartCollection.find({cartUser: useremail}).toArray();
      res.send(result);
    })


    app.post('/products', async (req, res) => {
        const newProduct = req.body;
        const result = await productsCollection.insertOne(newProduct);
        res.send(result)
    })
  
    app.post('/mycart', async (req, res) => {
      const newProduct = req.body;
        const result = await mycartCollection.insertOne(newProduct);
        res.send(result)
    })

     app.delete('/mycart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await mycartCollection.deleteOne(query);
            res.send(result);
        })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const option = {upsert : true}
      const updatedProduct = req.body
      const Product = {
        $set: {
          photo : updatedProduct.photo, 
          productName : updatedProduct.productName, 
          brandName : updatedProduct.brandName, 
          type : updatedProduct.type, 
          price : updatedProduct.price, 
          description : updatedProduct.description, 
          rating : updatedProduct.rating
 
        }

      }
      const result = await productsCollection.updateOne(filter, Product, option);
      res.send(result);
    })

    app.post('/users', async (req,res) =>{
      const newUser = req.body;
      console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

