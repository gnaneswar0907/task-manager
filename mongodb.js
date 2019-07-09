const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

mongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("error happened");
    }

    const db = client.db(databaseName);
    db.collection("users")
      .deleteOne({ age: 50 })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log("error");
      });
  }
);
