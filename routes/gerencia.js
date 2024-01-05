const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Tarefa')
const Tarefa = mongoose.model('tarefas')
const User = mongoose.model('users')
const {userAuth} = require('../helpers/cargo')
const {userCargo} = require('../helpers/cargo')


// Rotas GETs
router.get('/task', userAuth, (req, res) => {
    Tarefa.find().sort({date: 'desc'}).then((tarefas) => {
        res.render("main/task", {tarefas: tarefas})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um error ao listar as tarefas!")
    })
})

router.get('/task/addtask', userAuth, (req, res) => {
    res.render('main/createtask', {user: req.user})
})

// Rotas POSTs

router.get('/task/edit/:id', userAuth, (req, res) => {
    User.findOne({name: req.user.name}).then((users) => {
        if (users.cargo == "gerencia"){
            Tarefa.findOne({_id:req.params.id}).then((tarefa) => {
                res.render('main/edittask', {tarefa: tarefa})
            }).catch((err) => {
                req.flash('error_msg', 'A tarefa não existe!')
                res.redirect('/gerencia/task')
            })
        }else{
            req.flash('error_msg', 'Você não tem permissão para editar essa tarefa!')
            res.redirect('/gerencia/task')
        }

    }).catch((err) => {
        req.flash('error_msg', 'Erro desconhecido, tente novamente!')
        res.redirect('/gerencia/task')
    })
})

router.post('/task/del/:id', userAuth, (req, res) => {
    User.findOne({name: req.user.name}).then((users) => {
        if(users.cargo == "gerencia"){
            Tarefa.deleteOne({_id:req.body.id}).then(() => {
                req.flash('success_msg', 'Tarefa deletada com sucesso!')
                res.redirect('/gerencia/task')
            }).catch((err) => {
                req.flash('error_msg', 'Ocorreu um erro ao deletar, tente novamente!')
                res.redirect('/gerencia/task')
            })
        } else{
            req.flash('error_msg', 'Você não tem permissão para deletar essa tarefa!')
            res.redirect('/gerencia/task')
        }
    }).catch((err) => {
        req.flash('error_msg', 'Você não tem permissão para deletar essa tarefa!')
        res.redirect('/gerencia/task')
    })
})

router.post('/task/checked/:id/:bool', userAuth, (req, res) => {
    User.findOne({name: req.user.name}).then((users) => {
        if (users.cargo == "gerencia"){
            if (req.params.bool === 'true'){
                Tarefa.findOne({_id: req.params.id}).then((tarefa) => {
                    tarefa.pendent = false
                    tarefa.save().then(() => {
                        res.redirect('/gerencia/task')
                        req.flash('success_msg', tarefa.title + ' Tarefa concluída')
                    }).catch((err) => {
                        res.redirect('/gerencia/task')
                        req.flash('error_msg', 'Ocorreu um error, tente novamente!')
                    })
                }).catch((err) => {
                    res.redirect('/gerencia/task')
                    req.flash('error_msg', 'Ocorreu um error, tente novamente!')
                })
            }
            else{
                Tarefa.findOne({_id: req.params.id}).then((tarefa) => {
                    tarefa.pendent = true
                    tarefa.save().then(() => {
                        res.redirect('/gerencia/task')
                        req.flash('success_msg', tarefa.title + ' Tarefa concluída')
                    }).catch((err) => {
                        res.redirect('/gerencia/task')
                        req.flash('error_msg', 'Ocorreu um error, tente novamente!')
                    })
                }).catch((err) => {
                    res.redirect('/gerencia/task')
                    req.flash('error_msg', 'Ocorreu um error, tente novamente!')
                })
            }
        } else{
            req.flash('error_msg', 'Você não tem permissão para marcar como concluída essa tarefa!')
            res.redirect('/gerencia/task')
        }
    }).catch((err) => {
        res.redirect('/gerencia/task')
        req.flash('error_msg', 'Error desconhecido, tente novamente!')
    })
})

router.post('/task/edit', userAuth, (req, res) => {
    var erros = []

    if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
        erros.push({texto: 'Título inválido'})
    }

    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
        erros.push({texto: 'Conteúdo inválido'})
    }

    if(erros.length > 0){
        res.render('main/createtask', {erros: erros})
    }
    else{
        User.findOne({name: req.user.name}).then((users) => {
            if (users.cargo == "gerencia"){
                Tarefa.findOne({_id: req.body.id}).then((tarefa) =>{
                tarefa.title = req.body.title
                tarefa.content = req.body.content
                tarefa.cargo = 
                tarefa.save().then(() => {
                    req.flash('success_msg', 'Tarefa editada com sucesso!')
                    res.redirect('/gerencia/task')
                }).catch((err) => {
                    req.flash('error_msg', 'Ocorreu um error ao editar, tente novamente!')
                    res.redirect('/gerencia/task')
                })
            }).catch((err) => {
                req.flash('error_msg', 'A tarefa não existe!')
                })
            } else{
                req.flash('error_msg', 'Você não tem permissão para editar essa tarefa!')
                res.redirect('/gerencia/task')
            }
        })
    }
})

router.post('/task/addtask/successful', userAuth, (req, res) => {

    var erros = []

    if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
        erros.push({texto: 'Título inválido'})
    }

    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
        erros.push({texto: 'Conteúdo inválido'})
    }

    if(erros.length > 0){
        res.render('main/createtask', {erros: erros})
    }
    else{
        const novaTarefa = {
            title: req.body.title,
            content: req.body.content,
            creator: req.body.creator
        }
        new Tarefa(novaTarefa).save().then(()=>{
            req.flash("success_msg", 'Tarefa criada com sucesso!')
            res.redirect("/gerencia/task")
        }).catch((err)=> {
            req.flash("error_msg", 'Ocorreu um erro ao criar a tarefa, tente novamente!' + err)
            res.redirect("/gerencia/task")
        })
    }
})
module.exports = router