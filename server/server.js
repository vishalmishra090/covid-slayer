const express =  require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
require('./src/database')
const userRouter = require('./src/routers/user');
const gameRouter = require('./src/routers/game')


dotenv.config();
const port = process.env.PORT || 8008;

const app = express();

var corsOptions = {
    origin: process.env.CLIENT_URI || 'http://localhost:8888',
    credentials: true
}

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use((req,res,next) => {
    console.log(req.headers)
    next()
})
app.use(userRouter);
app.use(gameRouter);




app.get('*',(req,res) =>{
    res.status(404)
    res.send("404 Not Found")
})

app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
})

