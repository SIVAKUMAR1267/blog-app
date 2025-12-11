require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})
const blogs = mongoose.model('bloglist', blogSchema)

if (process.argv.length === 4) {
  const name = process.argv[2]
  const author = process.argv[3]

  const entry = new blogs({
    title: name,
    author: author,
    url: 'Unknown',
    likes: 0,
  })

  entry.save().then(() => {
    mongoose.connection.close()
  })
}
