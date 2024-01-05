module.exports = {
    userAuth: function(req, res, next){
        if (req.isAuthenticated()){
            return next()
        }else{
            req.flash('error_msg', 'Você deve está logado para continuar!')
            res.redirect('/')
        }
    },
    userCargo: function(req, res, next){
        if (req.users.cargo == 'gerencia'){
            return next()
        }else{
            req.flash('error_msg', 'Você deve ser da Gerência para alterar essa tarefa!')
            res.redirect('/gerencia/task')
        }
    }
}     