const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    slug : {
        type: String,
        required: true,
        unique: true
    },
    markdown : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    topics: {
        type: Array,
        required: true
    },
    authorId: {
        type: String,
        required: true,
        default: "admin"
    },
    upVotes: {
        type: Number
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true})
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next()
})

module.exports = mongoose.model('Article', articleSchema)