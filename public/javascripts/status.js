const showStatus = (element, status) => {
    status === true ?
        element.style.display = 'initial' :
        element.style.display = 'none';
}

// Elementos para los avisos de envío
const statusOne = document.getElementById('status-send-1');
const statusTwo = document.getElementById('status-send-2');

// Ocultamos ambos por defecto
showStatus(statusOne, false);
showStatus(statusTwo, false);

const sendMessage = async (e) => {
    e.preventDefault();

    // Elemento del formulario
    const form = document.getElementById('myform');

    // Obtengo los valores: N° destinatario y Mensaje
    const sendemail = form.querySelector('input[name="sendemail"]').value;
    const message = "";

    // Convertimos JSON a String
    const data = JSON.stringify({ sendemail, message });

    // Definimos parámetros opcionales
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: data // Insertamos la data que queremos enviar
    };

    // Hacemos el envío del mensaje a la siguiente ruta
    const response = await fetch('/send', options);

    if (response.status === 200) {

        // Mostramos aviso "Mensaje enviado correctamente"
        showStatus(statusOne, true);

        setTimeout(() => {
            // Ocultamos aviso
            showStatus(statusOne, false);
        }, 3500);

        // form.querySelector('textarea[name="message"]').value = '';
    } else {

        // Mostramos aviso "Error al enviar mensaje"
        showStatus(statusTwo, true);

        setTimeout(() => {
            // Ocultamos aviso
            showStatus(statusTwo, false);
        }, 3500);
    }
}
const showStatus = (element, status) => {
    status === true ?
        element.style.display = 'initial' :
        element.style.display = 'none';
}

// Elementos para los avisos de envío
const statusOne = document.getElementById('status-send-1');
const statusTwo = document.getElementById('status-send-2');

// Ocultamos ambos por defecto
showStatus(statusOne, false);
showStatus(statusTwo, false);

const sendMessage = async (e) => {
    e.preventDefault();

    // Elemento del formulario
    const form = document.getElementById('myform');

    // Obtengo los valores: N° destinatario y Mensaje
    const sendemail = form.querySelector('input[name="sendemail"]').value;
    const message = "";

    // Convertimos JSON a String
    const data = JSON.stringify({ sendemail, message });

    // Definimos parámetros opcionales
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: data // Insertamos la data que queremos enviar
    };

    // Hacemos el envío del mensaje a la siguiente ruta
    const response = await fetch('/send', options);

    if (response.status === 200) {

        // Mostramos aviso "Mensaje enviado correctamente"
        showStatus(statusOne, true);

        setTimeout(() => {
            // Ocultamos aviso
            showStatus(statusOne, false);
        }, 3500);

        // form.querySelector('textarea[name="message"]').value = '';
    } else {

        // Mostramos aviso "Error al enviar mensaje"
        showStatus(statusTwo, true);

        setTimeout(() => {
            // Ocultamos aviso
            showStatus(statusTwo, false);
        }, 3500);
    }
}
window.addEventListener('submit', sendMessage);