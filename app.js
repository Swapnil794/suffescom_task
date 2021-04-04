require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
express = require('express')
const app = express();

// imports routes
const authRoutes = require('./route/auth');
const userRoutes = require('./route/user');

// database connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=>{
    console.log(`CONNECT TO DATABASE`);
})

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// api calls
app.use('/suffescom',authRoutes);
app.use('/suffescom',userRoutes);

// port info
const port = process.env.Port || 4200;

// starting server
app.listen(port,()=>{
    console.log(`app is runing on ${port}`);
})