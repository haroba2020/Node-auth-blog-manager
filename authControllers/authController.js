const User = require("../modules/Users");
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

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}

module.exports.login_get = (req,res)=>{
    res.render('login');
}

const maxAge = 3* 24 * 60 * 60 

const createToken = (id) => {
    return jwt.sign({ id }, 'hrobos secret', {
        expiresIn: maxAge
    })
}

module.exports.login_post = async (req,res)=>{
    const {email, password} = req.body
    try {
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

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '',{maxAge: 1 })
    res.redirect('/')
}