/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Shaheid Amin Malik___________________ Student ID: __152600201____________ Date: _18-jan-2023_______________
*  Cyclic Link: _____https://dead-gold-deer-toga.cyclic.app__________________________________________________________
*
********************************************************************************/ 

// Setup
const express = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

// const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
// app.use(bodyParser.json());
app.use(express.json()); // built-in body-parser

app.use(cors());

/**************************************************************************** */
//* webapi example v4: template of CRUD operations to an entity - item
/**************************************************************************** */

// Deliver the app's home page to browser clients
app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
});

app.post("/api/movies", (req, res) => {
    // MUST return HTTP 201
    
        db.addNewMovie(req.body).then((data) => {
            res.status(201).json(data);
        }).catch((err)=>{
            res.json({ "err": "data does not exist" });
        })
});

app.get("/api/movies/:id", (req, res) => {

    db.getMovieById(req.params.id).then((data) => {
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    })
});

app.get("/api/movies", (req, res) => {


    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then(data => res.json(data))
        .catch((err) => {
            res.status(500).json(err);
        });

});

app.put("/api/movies/:id", (req, res) => {

    db.updateMovieById(req.body, req.params.id).then(() => {
        res.json({ "message": "updated" });
    }).catch((err)=>{
        res.json(err);
    })
});

// D - Delete item
app.delete("/api/movies/:id", (req, res) => {

    db.deleteMovieById(req.params.id).then(() => {
        res.status(200).json();
    }).catch((err) => {
        res.status(500).json(err);
    })
    // In a real app, do not send body data, instead just send...
    // res.status(204).end();
});


db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
