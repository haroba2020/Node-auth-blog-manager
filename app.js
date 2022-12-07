const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authMiddleware');
const { get } = require('http');
const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')

const dbURI = 'mongodb+srv://haroba:magnin@cluster0.bvxfvdp.mongodb.net/node-blogs?retryWrites=true&w=majority'
mongoose.connect(dbURI)
.then((result) => app.listen(3000))
.catch((err)=> console.log(err))

app.get('/',(req,res)=>{
    res.render('index')
})
app.use(authRoutes);
