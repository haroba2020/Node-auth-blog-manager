const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authMiddleware');
const { get } = require('http');
const app = express();
const Blog = require("./modules/Blogs");
const User = require("./modules/Users");
const jwt = require('jsonwebtoken')


app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')


const dbURI = 'mongodb+srv://haroba:magnin@cluster0.bvxfvdp.mongodb.net/node-blogs?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err)=> console.log(err))

app.get('*', checkUser)
app.get('/',(req,res)=>{

    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, 'hrobos secret', async (err, decodedToken) => {

            const user = await User.findById(decodedToken.id);
            

            await Blog.find({ email: user.email }).sort({ createdAt: -1})
            .then((result)=>{
                res.render('index', {title: 'All blogs', blogs: result})
            })
            .catch((err)=>{
                console.log(err)
            })
        });
    }else{
        res.redirect('/login')
    }

})
app.get('/blogs',(req,res)=>{
    res.render('index')
})

app.use(authRoutes);
