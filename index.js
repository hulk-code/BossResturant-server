const express = require('express')
const cors=require('cors')
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT ||3000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.bw2yndc.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const manuCollection = client.db("bossResturant").collection("manudata");
    const reviewsCollection = client.db("bossResturant").collection("reviewsdata");
    const cartCollection = client.db("bossResturant").collection("carts");
    const userCollection = client.db("bossResturant").collection("user");
    
     app.get('/menu' ,async(req ,res)=>{
        const result=await manuCollection.find().toArray()
        res.send(result)
     })
     app.get('/review' ,async(req ,res)=>{
        const result=await reviewsCollection.find().toArray()
        res.send(result)
     })

     //cart data
     app.post('/cart' , async(req ,res) =>{
      
      const cartitems=req.body;
      const result=await cartCollection.insertOne(cartitems);
      res.send(result)
     })

     app.get('/cart' ,async(req , res)=>{
      const email=req.query.email
      const query={email: email}
      const result=await cartCollection.find(query).toArray()
      res.send(result)
   })

   app.delete('/cart/:id',async (req , res)=>{
    const id=req.params.id;
    const query={_id :new ObjectId(id)}
    const result=await cartCollection.deleteOne(query);
    res.send(result)
   })

   //user Collection 
   app.post('/user' , async(req , res) =>{
    const users=req.body;
    const query={email :users.email}
    const existingUser=await userCollection.findOne(query)
    if(existingUser){
      return res.send({message :'user already exists' ,insertedId:null})
    }
    const result=await userCollection.insertOne(users);
    res.send(result)
   })
   app.get('/user' , async(req , res) =>{
     const result=await userCollection.find().toArray()
     res.send(result)
   })

   app.delete('/user/:id',async (req ,res)  =>{
    const id=req.params.id;
    const query={_id : new ObjectId(id)}
    const result=await userCollection.deleteOne(query)
    res.send(result)
   })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})