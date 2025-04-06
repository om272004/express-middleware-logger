const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(express.json());

// Using custom middleware 
app.use((req,res,next) => {
    const logs = {
        timestamp : new Date().toISOString(),
        method : req.method,
        url : req.url
    }
    fs.appendFile('logs.json', JSON.stringify(logs) + ",\n", (err) => {
        if(err) return console.error("Error writing logs : ", err);
    })
    next();
})

app.get("/logs",(req,res) => {
    fs.readFile('logs.json', 'utf-8', (err,data) => {
        if (err) {
            console.error("Error reading file : ", err);
            return;
        }
        try {
            const logs = data.trim().split("\n").map(line => JSON.parse(line));
            console.log("Logs :", logs);
        } catch (parseError){
            console.error("Invalid Format : ",parseError.message);
        }
        
    });
});

// Using third-party middleware
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send("Hello from the Express MiddleWare!");
})

// creating custom error for testing purpose
app.get('/error', (req, res, next) => {
    const err = new Error('Something went Wrong')
    next(err);
})

// Page not Found
app.use((req,res) => {
    res.status(404).send("Page not found");
})

// middleware for handling error
app.use((err, req, res, next) => {
    console.error("Error :", err.message);
    res.status(500).json({error : "Internal Server Error", message : err.message});
})

app.listen(3000, ()=> {
    console.log("Server started...")
})