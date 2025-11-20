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