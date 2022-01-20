require('./config/config')

const express = require('express')
const mongoose = require("mongoose")
const hbs = require('hbs')
const session = require('express-session')

const MongoStore = require('connect-mongo')

const app = express()

const Mongo_URL = process.env.URLDB

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(express.static(__dirname + '/public'));
const Master_key = process.env.KEY
app.use(session({
    secret: "secretkey",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    },
    resave: false,
    sameSite: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: Mongo_URL,
        autoReconnect: true
    })
}))

hbs.registerPartials(__dirname + '/views/parciales');


app.set('view engine', 'hbs');

app.use(require('./routes/webroutes'),)
app.listen(process.env.PORT, () => {
    console.log("Escuchando");
});
