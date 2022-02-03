const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

const router = express.Router();

const client = new MongoClient(process.env.DB_URI, {
    useUnifiedTopology: true,
});

let chat;

(async () => {
    await client.connect();
    chat = await client.db('chat');
})()

router.get('/', async (req, res) => {
    console.log(await chat.collection("users").findOneAndDelete({_id: ObjectId('61fa6306ee74df4c81449a32')}))
    res.send('Hello Chat')
});

module.exports = router;