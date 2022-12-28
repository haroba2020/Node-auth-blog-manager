const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique: true,
        lowercase:true,
        validate: [isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlength: [6,'Password must be at least 6 characters']
    },
    name:{
        type:String,
        required:[true, 'Please enter a username'],
        maxlength: [20,`username can't be over 20 characters`]    }
})


//Hashing the password and logging the user
userSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.post('save', function(doc, next){
    console.log('new user was created & saved', doc)
    next()
})


//method to log in User

// metode som sjekker email og passord for å authentisere bruker
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            //retunerer brukeren etter alt er bekrefter
            return user
        }
        throw Error ('incorrect password')
    }
    throw Error ('incorrect email')
}


const User = mongoose.model('user',userSchema)

module.exports = User