const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tesisdecimo88@gmail.com',
        pass: 'TesisDecimo27#'
    }
});

const sendMessage = async (req, res) => {
    ///////// email
    const { sendemail } = req.body;
    let mensaje = '';
    mensaje += 'Le recordamos que su mensualidad esta apunto de caducar.'
    let mailOptions = {
        from: 'tesisdecimo88@gmail.com',
        to: sendemail,
        subject: 'Recordatorio Pago Academia Ecuavoly',
        text: mensaje
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.json({
                msg: 'Mensaje enviado correctamente'
            });
            res.status(500).json({
                msg: 'Error al enviar mensaje'
            });
            console.log('Email enviado: ' + info.response);
        }
    });
    /////fin email
}

module.exports = sendMessage;