require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const { findByIdAndRemove } = require('./models/person')
const Person = require('./models/person')

const app = express()

morgan.token('req-body', (req,res) => {
  if (req.method === 'POST')
    return JSON.stringify(req.body)
  
  return null
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

  app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`)
    })
  })

  app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
  })

  app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
      console.log('person', person)
      if (person){
        console.log(person)
        res.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  app.post('/api/persons', (req, res) => {
    const body = {...req.body}
    
    if (!body.name || !body.number) {
      res.status(400).json({error: 'Name or number missing'})
    } else {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save().then(savedPerson => {
        res.status(201).json(person)
      })
      .catch(error => next(error))
    }
  })

  app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)

  const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    }
    next(error)
  }
  
  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })