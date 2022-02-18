const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.DB_URI, {
  useUnifiedTopology: true,
});

const initDBConnection = async () => {
  await client.connect();
}

module.exports = {
  ObjectId,
  client,
  chat: client.db('chat'),
  initDBConnection
};
