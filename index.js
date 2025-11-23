const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.port || 3000;

const uri = "mongodb+srv://movieDBUser:g66So5O6hDUP1hta@cluster0.a47ogqg.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middleware
app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    res.send('movie master pro server is running')
})

async function run() {
  try {
    await client.connect();

    const db = client.db('movie_db')
    const moviesCollection = db.collection("movies")
    const userCollection = db.collection('user')
    app.post('/user', async(req,res) => {
      const newUser = req.body
      const email = req.body.email
      const query= {email: email}
      const existingUser =await userCollection.findOne(query)
      if(existingUser){
        res.send({ message: 'user already exits. do not need to insert again' })
      }
      else{
        const result = await userCollection.insertOne(newUser)
        res.send(result)
      }
    })
    app.get('/user', async(req,res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/movies',async(req,res) => {
        const cursor = moviesCollection.find().sort({releaseYear: -1}).limit(6)
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/allMovies',async(req,res) => {
      // console.log(req.query)
        const cursor = moviesCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    // app.get('/products', async (req, res) => {
    //         // const projectFields = { title: 1, price_min: 1, price_max: 1, image: 1 }
    //         // const cursor = productsCollection.find().sort({ price_min: -1 }).skip(2).limit(2).project(projectFields);

    //         console.log(req.query)
    //         const email = req.query.email;
    //         const query = {}
    //         if (email) {
    //             query.email = email;
    //         }

    //         const cursor = productsCollection.find(query);
    //         const result = await cursor.toArray();
    //         res.send(result)
    //     });
    app.get('/allMovies/:id', async(req,res) => {
        const id = req.params.id;
        // const query ={_id: id}
        const query = { _id: new ObjectId(id) }
        const result = await moviesCollection.findOne(query)
        res.send(result)
    })
    //  app.get('/products/:id', async (req, res) => {
    //         const id = req.params.id;
    //         const query = { _id: id }
    //         const result = await productsCollection.findOne(query);
    //         res.send(result);
    //     })
    // my-collection apis
    app.get('/allMovies/my-collection',async(req,res) => {
      const email = req.query.email
      const query ={}
      if(email){
        query.email = email
      }
      const cursor = moviesCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    
    app.patch('/allMovies/:id',async(req,res) => {
        const id = req.params.id;
        const updateMovies = req.body;
        const query = {_id: new ObjectId(id)}
        const update = {
            $set: updateMovies,
            $currentDate: { updatedAt: true }
        }
        const result = await moviesCollection.updateOne(query,update)
        res.send(result)
    })
    // app.put('/allMovies/:id', async(req,res) => {
    //   const id = req.params.id
    //   const query ={_id: new ObjectId(id)}
    //   const result = await moviesCollection.updateOne(query)
    // })

    app.post('/allMovies/add',async(req,res) => {
        const newMovies = req.body;
        const result = await moviesCollection.insertOne(newMovies)
        res.send(result)
    })

    app.delete('/allMovies/:id', async(req,res)=> {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await moviesCollection.deleteOne(query)
        res.send(result)
    })

    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {

  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`movie master server is running port: ${port}`)
})

