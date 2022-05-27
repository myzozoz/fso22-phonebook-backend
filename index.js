const express = require('express')
const app = express()

let persons = [
    {
      name: "Arto Hellas",
      number: "040-1234567",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

  app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`)
  })

  app.get('/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === Number(req.params.id))
    console.log(person)

    if (!person) {
      res.status(404).end()
    } else (
      res.json(person)
    )
  })

 

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })