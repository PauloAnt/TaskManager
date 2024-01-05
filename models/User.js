const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cargo: {
        type: String,
        enum: ['gerencia', 'funcionario'],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

mongoose.model('users', User)