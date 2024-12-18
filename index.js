require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


console.log();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gekes.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const jobsCollections = client.db("jobPortal").collection("jobs");
        const applicationCollections = client.db("jobPortal").collection("job_applications")

        // All job api--

        app.get("/jobs", async(req, res) => {
            const cursor = jobsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // single job details api---

        app.get("/jobs/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await jobsCollections.findOne(query);
            res.send(result);
        })

        app.post("/job_applications", async(req, res) => {
            const applications = req.body;
            const result = await applicationCollections.insertOne(applications);
            res.send(result);
        })

        app.get("/job_applications", async(req, res) => {
            const email = req.query.email;
            const query = {applicant_email : email}
            const result = await applicationCollections.find(query).toArray();
            res.send(result);
        })





        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {


    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("My job-portal server is running now")
});

app.listen(port, () => {
    console.log(`My job-portal-server is running on port ${port}`);
})