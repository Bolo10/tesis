const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
var uuid = require('node-uuid');
const date = require('date-and-time');
//models
const usuario = require('../models/user');
//
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });
var { islogged, havepermissions } = require('../config/validations');
const URI = process.env.URLDB
const nodemailer = require('nodemailer');
var hbs2 = require('nodemailer-express-handlebars');
const myuser = process.env.MAIL
const mypass = process.env.PASSWORD
var path = require('path');
const user = require('../models/user');
const { exec } = require('child_process');

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err
    console.log("Base de datos online");
})

/*
GET CODE
*/

app.get('/', (req, res) => {



    res.render('home', {
        loged: req.session.loged,
        nombre: req.session.username,
        admin: req.session.role == 'ADMIN_ROLE' ? true : false,
        uid: req.session.uid
    })
});


app.get('/search', (req, res) => {
    var q = req.query.q

    usuario.find({
        nombre: {
            $regex: new RegExp(q)
        }
    }, {
        _id: 0,
        _V: 0
    }, function (err, data) {

        res.json(data);
    }).limit(5);



})
app.get('/signup', (req, res) => {
    res.render('signup', { loged: false })
})

app.get('/login', (req, res) => {
    res.render('login', { loged: false })
})

app.get('/profile', async (req, res) => {
    const user = await usuario.findOne({ uid: req.query.uid })

    res.render('profile', {
        user: user,
        loged: req.session.loged,
        nombre: req.session.username,
        admin: req.session.role == 'ADMIN_ROLE' ? true : false,
    })
})
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')

})

app.get('/dashboard', havepermissions, (req, res) => {
    res.render('dashboard', { loged: false, nombre: req.session.username })
})

app.get('/addregister', havepermissions, async (req, res) => {

    let mydate = date.parse(req.query.mydate, 'YYYY-MM-DD');
    let inidate = date.format(mydate, 'YYYY-MM-DD')
    let findate = date.addMonths(mydate, 1)
    findate = date.format(findate, 'YYYY-MM-DD')

    let monto = parseFloat(req.query.monto);

    const user = await usuario.findOne({ uid: req.query.uid })

    let historic = {
        initdate: inidate,
        findate: findate,
        monto: monto
    }
    user.historial.push(historic)
    //user.save()

    res.json("entro")
})

app.get('/users', havepermissions, (req, res) => {
    usuario.find({}, { email: 1, role: 1, nombre: 1, uid: 1, inscripcion: 1 }, (err, users) => {

        let message = false
        if (req.query.success) {
            message = true
        }
        res.render('users', { usuarios: users, message })

    })
})

app.get('/payusers', havepermissions, (req, res) => {

    usuario.find({}, { email: 1, role: 1, nombre: 1, uid: 1 }, (err, users) => {

        let message = false
        if (req.query.success) {
            message = true
        }
        res.render('userstopay', { usuarios: users, message })

    })
})



app.get('/adduser', havepermissions, (req, res) => {
    res.render('adduser', { message: false })

})

/*
app.on('find_user', function (value) {
    User.findOne({ username: value }, function (err, user) {
        if (err) throw err;
        if (!user) socket.emit('find_user_result', {});
        else socket.emit('find_user_result', user);
    });
})
*/

/*
POST CODE
*/

//LOGIN CODE
app.post('/login', async (req, res) => {
    const user = await usuario.findOne({ email: req.body.email.toLowerCase() })

    let err = false
    if (err) {
        // console.log("eror base");
    } else {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {

                    req.session.loged = true
                    req.session.role = user.role
                    req.session.nombre = user.nombre
                    req.session.username = user.username
                    req.session.email = user.email
                    req.session.uid = user.uid
                    res.redirect('/')
                } else {
                    res.render('login', { ok: false })

                }
            })

        } else {
            res.render('login', { ok: false })

        }
    }

})

//REGISTER CODE

app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = new usuario({
            uid: uuid(),
            nombre: req.body.nombre,
            username: req.body.username,
            email: req.body.email.toLowerCase(),
            password: hashedPassword
        })
        user.save()
        res.redirect('/login')
    } catch (error) {
        res.redirect('/signup')
    }

})



// UPDATE USER CODE

app.post('/updateuser', havepermissions, (req, res) => {
    let uid = req.body.uid


    Promise.all([
        usuario.findOne({ uid: uid }),

    ]).then(([usuario]) => {

        let admin = false
        if (usuario.role == 'ADMIN_ROLE') {
            admin = true
        }
        var pagado = false
        var nopagado = false
        if (usuario.incripcion == false) {
            pagado = false
            nopagado = true
        } else {
            pagado = true
            nopagado = false
        }



        res.render('updateuser', { usuario, admin, user: !admin })
    });
})

app.post('/doupdateuser', havepermissions, async (req, res) => {
    console.log(typeof (req.body.inscripcion));
    let user = {
        nombre: req.body.nombre,
        username: req.body.username,
        role: req.body.role,
        email: req.body.email,
        inscripcion: req.body.inscripcion
    }
    usuario.findByIdAndUpdate(req.body.uid, user, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            // 
            return res.redirect("/error")
        }

        res.redirect("dashboard")
    })

})

app.post('/updatepay', havepermissions, (req, res) => {
    let uid = req.body.uid


    Promise.all([
        usuario.findOne({ uid: uid }),

    ]).then(([usuario]) => {

        let admin = false
        if (usuario.role == 'ADMIN_ROLE') {
            admin = true
        }

        res.render('updatepay', { usuario, admin, user: !admin })
    });
})

app.get('/doupdatepay', havepermissions, async (req, res) => {
    let mydate = date.parse(req.query.mydate, 'YYYY-MM-DD');
    let inidate = date.format(mydate, 'YYYY-MM-DD')
    let findate = date.addMonths(mydate, 1)
    findate = date.format(findate, 'YYYY-MM-DD')
    let monto = parseFloat(req.query.monto);

    let idx = parseInt(req.query.idx)

    const user = await usuario.findOne({ uid: req.query.uid })

    let historic = {
        initdate: inidate,
        findate: findate,
        monto: monto
    }

    user.historial[idx] = historic

    //user.save()
    res.json(user)
})


app.post('/deleteuser', havepermissions, (req, res) => {
    let uid = req.body.duid
    usuario.deleteOne({ uid: req.body.duid }, function (err) {

    });

    res.redirect("dashboard")
})

module.exports = app