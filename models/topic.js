const mongoose = require('mongoose')
const slugify = require('slugify')



const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug : {
        type: String,
        required: true,
        unique: true
    },
    articles: {
        type: [String]
    }
})

topicSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true})
    }

    next()
})

module.exports = mongoose.model('Topic', topicSchema)