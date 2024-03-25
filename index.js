const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// console.log(process.env.DB_PASS)

// MidleWare 

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const username = encodeURIComponent('urbanAcademi');
const password = encodeURIComponent('PpZtwZG6zpAb8d15');

const uri = `mongodb+srv://${username}:${password}@cluster0.40yptof.mongodb.net/?retryWrites=true&w=majority`;


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
        const database = client.db("notice");
        const allNoticeCollection = database.collection("allNotice")


        app.get("/allNoticex10", async (req, res) => {
            const cursor = allNoticeCollection.find().sort({ _id: -1 }); 
            const allNotice = await cursor.toArray();
            res.send(allNotice);
        });
       



     
        app.post("/Newnotice", async (req, res) => {
            const newNotice = req.body;
            const result = await allNoticeCollection.insertOne(newNotice);
            res.send(result)
        })

        app.patch("/Newnotice/:id", async (req, res) => {
            const { id } = req.params; // Extract notice ID from URL
            const { title, description } = req.body; // Extract updated title and description from request body
        
            // Perform the update operation in the database
            const result = await allNoticeCollection.updateOne(
                { _id: new ObjectId(id) }, // Filter based on notice ID
                { $set: { title, description} } // Set new title, description, and updatedAt fields
            );
        
            // Check if the update operation was successful
            if (result.modifiedCount === 1) {
                res.status(200).json({ message: 'Notice updated successfully' });
            } else {
                res.status(404).json({ message: 'Notice not found' });
            }
        });

        app.delete("/Newnotice/:id", async (req, res) => {
            const { id } = req.params; // Extract notice ID from URL
        
            // Perform the delete operation in the database
            const result = await allNoticeCollection.deleteOne({ _id: new ObjectId(id) });
        
            // Check if the delete operation was successful
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Notice deleted successfully' });
            } else {
                res.status(404).json({ message: 'Notice not found' });
            }
        });

       





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(" successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.connect();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello pain!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})