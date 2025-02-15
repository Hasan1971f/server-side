const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jum05.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
        const visaCollection = client.db('visaDB').collection('visa');
        const appliedVisaCollection = client.db('visaDB').collection('appliedVisa');

        // Add visa apis
        app.get('/visa', async (req, res) => {
            const cursor = visaCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/visa', async (req, res) => {
            const newVisa = req.body
            console.log(newVisa)
            const result = await visaCollection.insertOne(newVisa)
            res.send(result)
        })




        app.put('/my-added-visa/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedVisa = req.body;
            const visa = {
                $set: {
                    countryUrl: updatedVisa.countryUrl,
                    countryName: updatedVisa.countryName,
                    visaType: updatedVisa.visaType,
                    processingTime: updatedVisa.processingTime,
                    fee: updatedVisa.fee,
                    validity: updatedVisa.validity,
                    applicationMethod: updatedVisa.applicationMethod,
                }
            };

            const result = await visaCollection.updateOne(filter, visa, options);
            res.send(result);
        });

        // Delete operation for my added visa
        app.delete('/my-added-visa/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await visaCollection.deleteOne(query);
            res.send(result);
        });



        

       
        // Applied Visa apis

        app.post('/applied-visa', async (req, res) => {
            const appliedVisa = req.body
            console.log(appliedVisa)
            const result = await appliedVisaCollection.insertOne(appliedVisa)
            res.send(result)
        })
        app.get('/applied-visa', async (req, res) => {
            const cursor = appliedVisaCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/applied-visa/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await appliedVisaCollection.deleteOne(query);
            res.send(result);
        });



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Visa Navigator server is running on successfully')
})



app.listen(port, () => {
    console.log(`Visa Navigator server is running on port: ${port}`)
})

// 
// 
// 