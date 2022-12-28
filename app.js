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


//middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')

//connect til databasen og koble seg til
const dbURI = 'mongodb+srv://haroba:magnin@cluster0.bvxfvdp.mongodb.net/node-blogs?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err)=> console.log(err))

// * på alle get requests for å sjekke om de har logget in med bruk av cookies
app.get('*', checkUser)


app.get('/',(req,res)=>{

    //lager en jwt web token og decrypterer den for å kunne finne bruker emailen som brukes til å sortere ned all blogs som vises
    // sån at det er bare blogs med riktig email som vises (riktig email blir laget automatisk når man lager en blog)
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
//koble til resten av rutene
app.use(authRoutes);
