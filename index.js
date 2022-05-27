require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
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

  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
  })

  app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
      console.log(person)
      res.json(person)
    })
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
    }
  })

  app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(p => p.id !== Number(req.params.id))
    res.status(204).end()
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })