const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.je3vw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('geniusMechanic');
        const servicesCollection = database.collection('services');

        // GET ALL DATA API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            console.log('single service', id)
            res.json(service)
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitting the psot', service);
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        });

        // DELeTE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Car Server');
});

app.get('/hello', (req, res) => {
    res.send('hello updated here');
})

app.listen(port, () => {
    console.log('Running Genius Mechanics on port ', port);
});




/*
one time:
1. heroku account open
2. heroku software install

Every project:
1. git init
2. .gitignore (node_module, .env)
3. push everything to git
4. make sure you have this script: "start": "node index.js",
5. make sure : put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main

-----------------------

Update:
1. save everything check locally
2. git add, git commit, git push
3. git push heroku main
*/