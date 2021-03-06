const mongoose = require("mongoose")
let schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator');
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}
let estadosValidos = {
    values: ['ACTIVA', 'ELIMINADA', 'SIN_CONFIRMAR'],
    message: '{VALUE} no es un estado válido'
}
let usuarioSchema = new schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    uid: {
        type: String,
        required: [false, 'El uid es requerido']
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es requerido"]
    },
    email: {
        type: String,
        required: [true, "El correo es requerido"],
        unique: true
    },
    edad: {
        type: Number,

    },
    cell: {
        type: String,
        default: ''
    },
    posicion: {
        type: String,
        default: ''
    },
    horario: {
        type: String,
        default: ''
    },
    sexo: {
        type: String,
        default: ''
    },
    entrenador: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
        required: true
    },
    estado: {
        type: String,
        default: 'SIN_CONFIRMAR',
        enum: estadosValidos,
        required: true
    }, historial: {
        type: [Object],
        initdate: { type: String },
        findate: { type: String },
        monto: { type: Number },
    }, inscripcion: {
        type: Boolean,
        default: false

    }, mensual: {
        type: Number,
        default: 20
    }
}, { collection: 'users' })
usuarioSchema.plugin(uniqueValidator, { message: `{PATH} debe ser único` })
usuarioSchema.methods.toJSON = function () {
    let user = this
    let userobject = user.toObject()
    delete userobject.password
    return userobject
}
module.exports = mongoose.model('Usuario', usuarioSchema, 'users')