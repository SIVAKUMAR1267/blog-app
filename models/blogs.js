const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true,
  },
  author: {
    minlength: 3,
    type: String,
    required: true,
  },
  url: {
    minlength: 5,
    unique: true,
    type: String,
    required: true,
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      type: String,
    },
  ],
})
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('blogs', blogSchema)
