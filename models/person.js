const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log(`Connecting to ${url}...`)

mongoose
  .connect(url)
  .then((result) => {
    console.log('Connection to MongoDB successful')
  })
  .catch((error) => {
    console.log(`Error while connecting to MongoDB: ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (val) => {
        const parts = val.split('-')
        if (parts.length != 2 || parts[0].length < 2 || parts[0].length > 3) {
          return false
        }
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
