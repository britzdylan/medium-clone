const mongoose = require('mongoose')
const slugify = require('slugify')

const authorSchema = new mongoose.Schema({
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
    }
})

authorSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true})
    }

    next()
})

module.exports = mongoose.model('Author', authorSchema)