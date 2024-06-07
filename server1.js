const express = require("express");

//Configuring the Express App
const app = express();
app.use(express.json());
app.set("port", 3000);


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

// Static file serving
app.use(express.static(__dirname + "/static"))

// Connecting to mongoDB
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(
  "mongodb+srv://muhammadidris204:King7Muhammad7@cluster0.lrrwmeo.mongodb.net/"
);
var db = client.db("muhammadadamidris_cw2");

// Logger Middleware
app.use((req, res, next) => {
  var log = `${req.ip} -- ${req.method} ${req.path} ${res.statusCode}"`;
  console.log(log, req.body);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Select a collection, e.g., /collection/lessons");
});

// Retrieve all the object from an collection
app.get("/collection/:collectionName", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .find({})
      .toArray()
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

// Search in "courses" collection (query)
app.post("/search/collection/courses/", (req, res) => {
  try {
    var search = req.body.search;
    var sort = req.body.sort || "title";
    var order = req.body.order == "desc" ? -1 : 1;

    if (search) {
      search = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    } else {
      search = {};
    }

    db.collection("courses")
      .find(search)
      .sort({ [sort]: order })
      .toArray()
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

//Insert a document into collection "courses"
app.post("/collection/:collectionName", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .insertOne(req.body)
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

// GET a single document by ID
app.get("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

//to update a document by ID
app.put("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

// Delete a Document by ID
app.delete("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

// Stating the server
app.listen(3000, () => {
  console.log("Express.js server running at PORT 3000");
});
