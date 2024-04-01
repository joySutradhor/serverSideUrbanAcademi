const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path') ;
require('dotenv').config();
const port = process.env.PORT || 5000;

// console.log(process.env.DB_PASS)

// MidleWare 

app.use(cors());
app.use(express.json());

// pdf post method 
// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images'); // Destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Define filename for uploaded file
    }
  });
  
  // Initialize multer
  const upload = multer({ storage: storage });
  

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileName = req.file.filename; // Get the filename of the uploaded file

    res.json(fileName);
});



// Route for downloading the PDF file
app.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'uploads/images', fileName);
    
    // Send the file as an attachment
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            return res.status(500).json({ message: 'Error downloading file' });
        }
    });
});


  


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