const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tarefa = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    pendent:{
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        required: true
    }
})
mongoose.model('tarefas', Tarefa)