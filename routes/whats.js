

const sendWhats = (number, nombre, monto, fecha, mensual) => {
    var url = 'https://wa.me/593' + number + '?text='
    var mensaje = 'Hola%20*' + nombre + '*%20te%20recordamos%20que%20tu%20mensual%20de%20la%20fecha%20*'
    mensaje += fecha + '*%20esta%20por%20terminar%20tu%20abono%20en%20este%20mes%20fue%20de%20*' + monto + '*%20y%20tu%20mensualidad%20es%20de%20*' + mensual
    mensaje += '*%20te%20recordamos%20pagar%20lo%20mas%20pronto%20posible.%20Somos%20EMM'
    url = url + mensaje
    return url
}


module.exports = { sendWhats }