const User = require("../modules/Users");
const Blog = require("../modules/Blogs");
const jwt = require('jsonwebtoken')

// error handler
const ErrorHandler = (err) => {

    let errors = {email:'',password:'',name:''};
    console.log(err.code)

    //shaun netninja kode som jeg har her fordi vill sjekke om det funker med.
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }
    
    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }
    // går gjennom vær error melding med "user validation failed" og retunerer de
    if(err.message.includes('user validation failed:')){
        Object.values(err.errors).forEach((properties)=>{
            errors[properties.path] = properties.message
        })
    }
    if(err.code === 11000){
         errors.name = 'username or email is allready in use'
    }
    return errors
}

// Enkle get requests
module.exports.signup_get = (req,res)=>{
    res.render('signup');
}

module.exports.login_get = (req,res)=>{
    res.render('login');
}
module.exports.blog_create_get = (req,res)=>{
    res.render('create');
}

// get request som ser etter /blog id ved bruk av req.params.id derreter så finner den en spesifik blog ved bruk av id og sender den tilbake til siden
module.exports.blog_details = (req,res) => {
    const id = req.params.id
    Blog.findById(id)
    .then(result =>{
        res.render('browser', {blog: result})
    })
    .catch(err =>{
        res.status(404).render('404')
    });
}

const maxAge = 3* 24 * 60 * 60 

//en jwt cookie som tar in user id som lagres for senere bruk
const createToken = (id) => {
    return jwt.sign({ id }, 'hrobos secret', {
        expiresIn: maxAge
    })
}

module.exports.login_post = async (req,res)=>{
    const {email, password} = req.body
    try {
        //Logger inn user og lager en cookie med user id
        const user = await User.login(email,password)
        const token = createToken(user._id)

        res.cookie('jwt',token, {httpOnly:true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id})

    }

    catch(err){
        const errors = ErrorHandler(err)
        res.status(400).json({ errors })
    }
}


module.exports.signup_post = async (req,res)=>{
    const {email, password, name} = req.body
    console.log(req.body)
    try {
        //lager en user og en cookie med user id
        const user = await User.create({email,password,name})
        const token = createToken(user._id)
        res.cookie('jwt',token, {httpOnly:true, maxAge: maxAge * 1000})
        res.status(201).json({user: user._id})


    } catch (err) {
        const errors = ErrorHandler(err)
        console.log("Got error",errors, err)
        res.status(400).json({errors})
    }
}

//en get request som fjerner cookien for å kunne logge seg ut og umidelbart redirecter deg til index
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '',{maxAge: 1 })
    res.redirect('/')
}

//en post request som lagrer en blog
module.exports.blog_create_post = (req, res) =>{
    const blog = new Blog(req.body)   
    
    blog.save()
    .then((result)=>{
        res.redirect('/')
    })
    .catch((err)=>{
        console.log(err)
        res.redirect('404')
    })
}
//delete request som finner id til en blog og fjerner den basert på det
module.exports.blog_delete = (req, res) =>{
    const id = req.params.id

    Blog.findByIdAndDelete(id)
    .then(result=>{
        res.json({ redirect: '/' });
    })
    .catch(err=>{
        console.log(err)
    })
}