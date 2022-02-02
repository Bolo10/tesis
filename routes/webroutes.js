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
const dev = process.env.URLOCAL
const prod = process.env.URLDB
var path = require('path');
const user = require('../models/user');
const { exec } = require('child_process');
var { sendWhats } = require('./whats.js')
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err
    console.log("Base de datos online");
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tesisdecimo88@gmail.com',
        pass: 'TesisDecimo27#'
    }
});

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

app.get('/updateprofile', islogged, async (req, res) => {
    const user = await usuario.findOne({ uid: req.query.uid })

    res.render('updateprofile', {
        usuario: user,
        loged: req.session.loged,
        nombre: req.session.username,
        uid: req.session.uid,
        admin: req.session.role == 'ADMIN_ROLE' ? true : false,
    })
})

app.get('/profile', async (req, res) => {
    const user = await usuario.findOne({ uid: req.query.uid })


    if (user.sexo == "men") {
        var sexo = true

    } else {
        var sexo = false

    }
    res.render('profile', {
        user: user,
        sexo: sexo,
        loged: req.session.loged,
        nombre: req.session.username,
        uid: req.session.uid,
        admin: req.session.role == 'ADMIN_ROLE' ? true : false,
    })
})
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')

})

app.get('/dashboard', havepermissions, (req, res) => {
    let data = {
        loged: req.session.loged,
        role: req.session.role,
        nombre: req.session.nombre,
        username: req.session.username,
        email: req.session.email,
        uid: req.session.uid
    }
    res.render('dashboard', { loged: true, data: data })
})

app.post('/addregister', havepermissions, async (req, res) => {


    let mydate = date.parse(req.body.mydate, 'YYYY-MM-DD');
    let inidate = date.format(mydate, 'YYYY-MM-DD')
    let findate = date.addMonths(mydate, 1)
    findate = date.format(findate, 'YYYY-MM-DD')

    let monto = parseFloat(req.body.monto);

    const user = usuario.findOne({ _id: req.body.uid }, (err, data) => {

        let historic = {
            initdate: inidate,
            findate: findate,
            monto: monto
        }
        data.historial.push(historic)


        // FUNCION DE NO REPETIR FECHAS 

        usuario.findByIdAndUpdate(data._id, { historial: data.historial }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {

            if (err) {
                return res.redirect("/error")
            }

        })

    });

    let mensaje = '';
    mensaje += 'Su pago se ha realizado con exito'
    let mailOptions = {
        from: 'tesisdecimo89@gmail.com',
        to: user.email,
        subject: 'Abono Academia Ecuavoly Registrada',
        text: mensaje
    };
    transporter.sendMail(mailOptions, function (error, info) {

    });

    res.json({ ok: true })

})

app.get('/users', havepermissions, (req, res) => {

    usuario.find({}, { email: 1, role: 1, nombre: 1, uid: 1, inscripcion: 1 }, (err, users) => {

        let message = false
        if (req.query.success) {
            message = true
        }
        let data = {
            loged: req.session.loged,
            role: req.session.role,
            nombre: req.session.nombre,
            username: req.session.username,
            email: req.session.email,
            uid: req.session.uid
        }
        res.render('users', { usuarios: users, data: data })

    })
})

app.get('/payusers', havepermissions, (req, res) => {

    usuario.find({}, { email: 1, role: 1, nombre: 1, uid: 1 }, (err, users) => {

        let message = false
        if (req.query.success) {
            message = true
        }
        let data = {
            loged: req.session.loged,
            role: req.session.role,
            nombre: req.session.nombre,
            username: req.session.username,
            email: req.session.email,
            uid: req.session.uid
        }
        res.render('userstopay', { usuarios: users, data: data })

    })
})

let getToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    today = date.parse(today, 'YYYY-MM-DD');
    var yesterday = date.addDays(today, -1)
    var tomorrow = date.addDays(today, 1)

    return [today, yesterday, tomorrow]
}
app.get('/pays', havepermissions, (req, res) => {

    var actuales = []
    var vencidos = []
    var proximos = []
    usuario.find({
        'entrenador': { $in: req.query.uid }
    }, { email: 1, role: 1, nombre: 1, uid: 1, inscripcion: 1, historial: 1, cell: 1 }, (err, users) => {
        users.forEach(user => {
            if (user.historial.length !== 0) {
                user.historial.forEach(element => {
                    let userdate = date.parse(element.findate, 'YYYY-MM-DD');
                    let days = getToday()
                    let today = days[0]
                    let yesterday = days[1]
                    let tomorrow = days[2]
                    if (userdate < yesterday) {

                        let data = {
                            uid: user.uid,
                            nombre: user.nombre,
                            vencido: date.format(userdate, 'YYYY-MM-DD'),
                            monto: element.monto,
                            url: sendWhats(user.cell, user.nombre.replace(" ", "%20"), String(element.monto), element.findate, '25')
                        }
                        vencidos.push(data)
                    }
                    if (userdate > tomorrow) {
                        let data = {
                            uid: user.uid,
                            nombre: user.nombre,
                            proximo: date.format(userdate, 'YYYY-MM-DD'),
                            monto: element.monto,
                            url: sendWhats(user.cell, user.nombre.replace(" ", "%20"), String(element.monto), element.findate, '25')
                        }
                        proximos.push(data)
                    }
                    if (userdate == today || userdate >= yesterday && userdate <= tomorrow) {
                        let data = {
                            uid: user.uid,
                            nombre: user.nombre,
                            actual: date.format(userdate, 'YYYY-MM-DD'),
                            monto: element.monto,
                            url: sendWhats(user.cell, user.nombre.replace(" ", "%20"), String(element.monto), element.findate, '25')
                        }
                        actuales.push(data)
                    }



                });
            }


        });

        let data = {
            loged: req.session.loged,
            role: req.session.role,
            nombre: req.session.nombre,
            username: req.session.username,
            email: req.session.email,
            uid: req.session.uid
        }
        res.render('mypays', { vencidos: vencidos, proximos: proximos, actuales: actuales, data: data })
    });

})
app.get('/myusers', havepermissions, (req, res) => {
    usuario.find({
        'entrenador': { $in: req.query.uid }
    }, { email: 1, role: 1, nombre: 1, uid: 1, inscripcion: 1, historial: 1 }, (err, users) => {

        let data = {
            loged: req.session.loged,
            role: req.session.role,
            nombre: req.session.nombre,
            username: req.session.username,
            email: req.session.email,
            uid: req.session.uid
        }
        res.render('myusers', { usuarios: users, data: data })
    });

})

app.get('/adduser', havepermissions, (req, res) => {
    res.render('adduser', { message: false })

})


/*
POST CODE
*/

//LOGIN CODE
app.post('/login', async (req, res) => {
    const user = await usuario.findOne({ email: req.body.email.toLowerCase() })

    let err = false
    if (err) {

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
            nombre: req.body.nombre.toLowerCase(),
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

    let user = {
        nombre: req.body.nombre,
        username: req.body.username,
        role: req.body.role,
        email: req.body.email,
        inscripcion: req.body.inscripcion,
        entrenador: req.body.entrenador
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

    user.save()

    res.json(user)
})


app.post('/deleteuser', havepermissions, (req, res) => {

    usuario.deleteOne({ uid: req.body.duid }, function (err) {
    });

    res.redirect("dashboard")
})

app.post('/recuperarPass', async (req, res) => {
    const user = await usuario.findOne({ email: req.body.email.toLowerCase() })

    let err = false
    if (err) {

    } else {

        if (user) {

            let mensaje = '';
            mensaje += 'De clic en el siguiente enlace para realizar el cambio de su contraseña: https://app-emm.herokuapp.com/editarPass?uid=' + user.uid

            let mailOptions = {
                from: 'tesisdecimo88@gmail.com',
                to: user.email,
                subject: 'Recuperación de contraseña',
                text: mensaje
            };
            transporter.sendMail(mailOptions, function (error, info) {

            });
            res.redirect('/login')


        } else {
            res.render('login', { ok: false })

        }
    }



})


app.get('/recuperarPass', (req, res) => {
    res.render('recuperarPass', { loged: false })
})
app.get('/editarPass', (req, res) => {

    let uid = req.query.uid


    Promise.all([
        usuario.findOne({ uid: uid }),

    ]).then(([usuario]) => {

        let admin = false
        if (usuario.role == 'ADMIN_ROLE') {
            admin = true
        }

        res.render('editarPass', { usuario, admin, user: !admin })
    });
})
app.post('/doupdatePass', async (req, res) => {
    if (req.body.password == '') {

        if (err) {
            // 
            return res.redirect("/error")
        }

    } else {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = {
            password: hashedPassword
        }
        usuario.findByIdAndUpdate(req.body.idusuario, user, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
            if (err) {

                return res.redirect("/error")
            }
            var string = encodeURIComponent(true);
            res.redirect("/login?success=" + string)
        })
    }
})

app.post('/change', (req, res) => {
    let iduser = req.body.uid

    switch (req.body.atr) {
        case 'nombre':
            usuario.findByIdAndUpdate(iduser, { nombre: req.body.data }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }
                req.session.nombre = req.body.data
                res.json({ ok: true })
            })
            break;
        case 'username':
            usuario.findByIdAndUpdate(iduser, { username: req.body.data }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }
                req.session.username = req.body.data
                res.json({ ok: true })
            })
            break;
        case 'email':
            usuario.findByIdAndUpdate(iduser, { email: req.body.data }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }
                req.session.email = req.body.data
                res.json({ ok: true })
            })
            break;
        case 'edad':
            usuario.findByIdAndUpdate(iduser, { edad: req.body.data }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }

                res.json({ ok: true })
            })
            break;
        case 'cell':
            let cel = req.body.data.substring(1)

            usuario.findByIdAndUpdate(iduser, { cell: cel }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }

                res.json({ ok: true })
            })
            break;
        case 'posicion':
            usuario.findByIdAndUpdate(iduser, { posicion: req.body.data }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }

                res.json({ ok: true })
            })
            break;
        case 'horario':
            usuario.findByIdAndUpdate(iduser, { horario: req.body.data }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }

                res.json({ ok: true })
            })
            break;
        case 'sexo':
            usuario.findByIdAndUpdate(iduser, { sexo: req.body.data }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                if (err) {
                    return res.redirect("/error")
                }

                res.json({ ok: true, sexo: true })
            })
            break;
        case 'password':
            usuario.findById({ _id: iduser }, (err, user) => {
                bcrypt.compare(req.body.apassword, user.password, (err, result) => {
                    if (result) {
                        bcrypt.hash(req.body.npassword, 10, function (err, hashedPassword) {

                            usuario.findByIdAndUpdate(iduser, { password: hashedPassword }, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
                                if (err) {
                                    return res.redirect("/error")
                                }
                                //req.session.email = req.body.data
                                res.json({ ok: true })
                            })

                        })
                    } else {
                        res.json({ ok: false })
                    }
                })
            })
            break;
    }
})

app.get('*', function (req, res) {
    res.redirect('/');
});

module.exports = app