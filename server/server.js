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

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());
app.use(userRouter);
app.use(gameRouter);


app.get('*',(req,res) =>{
    res.status(404)
    res.send("404 Not Found")
})

app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
})

