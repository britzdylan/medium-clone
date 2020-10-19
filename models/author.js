const mongoose = require('mongoose')
const slugify = require('slugify')

const authorSchema = new mongoose.Schema({
    googleId : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    fName: {
        type: String
    },
    lName: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String
    },
    twitterHandle: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    articles : [Object]
})

authorSchema.pre('validate', function(next) {
    if (this.username) {
        
        this.slug = slugify(this.username, { lower: true, strict: true})
    }

    next()
})

module.exports = mongoose.model('Author', authorSchema)