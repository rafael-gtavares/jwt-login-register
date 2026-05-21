// Imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Inicia a aplicação
const app = express()

// Config JSON reponse
app.use(express.json())

// Models
const User = require('./models/User.js')

// Open Route - Public Route - Rota pública para todos os usuários
app.get('/', (req, res) => {
    res.status(200).json({
        msg: "Bem vindo a nossa API"
    })
})

// Private Route
app.get("/users/:id", checkToken, async (req, res) => {
    const id = req.params.id

    // check user exists
    const user = await User.findById(id, '-password')
    
    if(!user) {
        return res.status(404).json({
            msg: "Usuário não encontrado"
        })
    }

    res.status(200).json({ user })
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // Caso tente acessar sem token
    if (!token) {
        return res.status(404).json({
            msg: "Acesso negado"
        })
    }

    try{
        const secret = process.env.secret
        jwt.verify(token, secret)
        next()
    } 
    // Caso tente acessar com outro token
    catch(err) {
        res.status(400).json({
            msg: "Token inválido"
        })
    }
}

// Register User
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    // Validations
    if (!name) {
        return res.status(422).json({
            msg: "O nome é obrigatório"
        })
    }

    if (!email) {
        return res.status(422).json({
            msg: "O email é obrigatório"
        })
    }

    if (!password) {
        return res.status(422).json({
            msg: "A senha é obrigatória"
        })
    }
    if (!confirmpassword) {
        return res.status(422).json({
            msg: "A confirmação de senha é obrigatória"
        })
    }
    if (password !== confirmpassword) {
        return res.status(422).json({
            msg: "A senha e a sua confirmação devem ser iguais"
        })
    }

    // check if user exists
    const userExists = await User.findOne({ email: email })
    if (userExists) {
        return res.status(422).json({
            msg: "Use outro email"
        })
    }

    // create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create user
    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save()
        res.status(201).json({
            msg: "Usuário criado com sucesso"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Aconteceu um erro no servidor"
        })
    }
})

// Login User
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    // Validations
    if (!email) {
        return res.status(422).json({
            msg: "O email é obrigatório"
        })
    }

    if (!password) {
        return res.status(422).json({
            msg: "A senha é obrigatória"
        })
    }

    // check if user exists
    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(404).json({
            msg: "Usuário não encontrado"
        })
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({
            msg: "Senha incorreta"
        })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id
        }, secret,
        { expiresIn: '1h' })

        res.status(201).json({
            msg: "Autenticação realizada com sucesso. Token: " + token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Erro no servidor"
        })
    }
})

// Get Users
app.get('/users', async (req, res) => {
    const users = await User.find()

    res.status(200).json(users)
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Porta que escuta a aplicação
        app.listen(3000)
        console.log("Conectou ao banco!")
    })
    .catch((err) => {
        console.log(err)
    })

