const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const {userAuth} = require('./helpers/cargo')
const {userCargo} = require('./helpers/cargo')

// Autenticação
const passport = require('passport')
require("./config/auth")(passport)

// Conexão com o Banco de Dados e Modelos
mongoose.connect('mongodb://localhost/GerenciadorDeTarefas').then(() => {
    console.log("Conectado ao BD!")
}).catch((err) => {
    console.log("Ocorreu algum erro!" + err)
})
require("./models/User");
const User = mongoose.model("users");

// Configuração (bodyParser, handlebars, mongoose, session, flash)
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.engine('handlebars', handlebars.engine({defaultLayout:'main',
runtimeOptions: {
    allowProtoPropertiesByDefault: true,
}}))
app.set('view engine', 'handlebars')

// Arquivos Estáticos
app.use(express.static(__dirname + "/public"))

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

// Rotas
const gerencia = require('./routes/gerencia')
const users = require('./routes/users')
app.use('/gerencia', gerencia)
app.use('/users', users)

app.get('/', (req, res) => {
    if (userAuth){
        res.render('main/index', {logado: true, layout: 'main'})
    }
    else{
        res.render('main/index', {logado: false, layout: 'main'})
    }
})

const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log("Servidor rodando! http://localhost:" + PORT)
})
