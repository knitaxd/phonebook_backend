const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req) => JSON.stringify(req.body))

// Middlewares
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))


let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

// Get persons saved on phonebook
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Info section
app.get('/info',(request, response) => {
    const people = persons.length
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${people} people</p>
        <p>${date}</p>
        `)
})

//Get the data for every person on phonebook
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//Generate the id for new persons
const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}

//Delete a person from their id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

//Add new person to the phonebook
app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'),(request, response) => {
    const body = request.body


    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number

    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
