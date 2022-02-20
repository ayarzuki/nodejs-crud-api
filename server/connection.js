//Modul Mongodb
const MongoClient = require('mongodb').MongoClient;
// const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017/';

const client = new MongoClient(url, { useNewUrlParser: true });

module.exports = client;
