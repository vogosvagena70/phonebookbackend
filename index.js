const express = require('express')
//var morgan = require('morgan')
const app = express()
const cors = require('cors')


app.use(express.json())
// morgan.token('asd', req => {
//     return JSON.stringify(req.body)
// })
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// app.use(morgan(':method :url :body'))
app.use(cors())
app.use(express.static('build'))


//app.use(requestLogger)
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "Bassel Itani",
        "number": "09060672336"
    }
]

app.get('/', (request, response) => {
    console.log('hello')
    response.send('Hello')
})

app.get('/api/persons', (request, response) => {
    console.log('Getting all persons')
    response.json(persons)
    response.status(204)
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    if (!request.body) {
        return response.status(400).json({
            error: 'Missing data'
        })
    }
    if (!request.body.name) {
        return response.status(400).json({
            error: 'Name is missing'
        })
    }
    if (!request.body.number) {
        return response.status(400).json({
            error: 'Number is missing'
        })
    }
    if (request.body.name === '') {
        return response.status(400).json({
            error: 'Name cant be empty'
        })
    }
    if (persons.filter(p => p.name === request.body.name).length > 0) {
        return response.status(400).json({
            error: 'Same name already found'
        })
    }
    const newID = Math.max(...persons.map(c => c.id)) + 1
    newPerson.id = newID
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    if (persons.filter(p => p.id === id).length === 0) {
        response.status(404).end()
    } else {
        const person = persons.find(p => p.id === id)
        response.json(person)
    }

})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    console.log(id)
    if (persons.filter(p => p.id === id).length === 0) {
        response.status(404).end()
    } else {
        persons = persons.filter(p => p.id !== id)
        console.log(persons)
        response.status(204).end()
    }

})

app.get('/info', (request, response) => {

    const today = new Date()
    response.send(`Phonebook has ${persons.length} people </br>  ${today}`)




})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const port = 3001
app.listen(port, () => {
    console.log(`server running on ${port}`)
})