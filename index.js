require('dotenv').config()
const express = require('express')
//var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())


app.use(cors())
app.use(express.static('build'))


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
    Person.find({}).then(rs => {
        response.json(rs)
    })
})

app.post('/api/persons', (request, response,next) => {
    const body = request.body
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    //const newPerson = request.body
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
    newPerson.save().then(rs => {
        response.json(rs)
    }).catch(ex=>next(ex))

})

app.put('/api/persons/:id',(request,response,next)=>{
    const body = request.body
    const  newPerson = {
        name:body.name,
        number:body.number
    } 
    Person.findByIdAndUpdate(request.params.id,newPerson,{runValidators: true}).
    then(rs=>{response.json(rs)})
    .catch(ex=>next(ex))
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id).then(rs =>
        response.json(rs)).catch(ex => next(ex))


})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(rs => {
        response.status(204).end()
    }).catch(ex => next(ex))


})

app.get('/info', (request, response) => {

    const today = new Date()
    response.send(`Phonebook has ${persons.length} people </br>  ${today}`)




})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.log(error.name)
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: `ID is in wrong format`
        })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})