require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const db_connect = require('./utils/db.connection');
const userRouter = require('./routes/user-route');

const app = express();
const port = parseInt(process.env.PORT || 8000);


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(userRouter);
app.use(cookieParser());


app.use((err,req,res,next) => {
    const { status = 500, message= "something went wrong"} = err;
    res.status(status).json({message});
})

db_connect().then(() => {
    app.listen(port, () => {
        console.log(`server is up and listen on port ${port}`)
    })
}).catch(() => {
    console.log('something went wrong while connecting to database')
})

