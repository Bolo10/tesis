function appendRegister() {
    var d = document.getElementById('register');
    var d_nested = document.getElementById('anidado');
    var throwawayNode = d.removeChild(d_nested);
    showSpinner();
    setTimeout(() => {
        removeSpinner()
        var txt = "<div class='row' id='inputs'>"
        txt += "          <div class='col d-flex  justify-content-center align-items-center mt-2'>"
        txt += "               <input type='date' id='date' onchange='validation()' class='form-control rounded'"
        txt += "                   aria-describedby='inputGroup-sizing-lg'>"
        txt += "           </div>"
        txt += "           <div class='col d-flex  justify-content-center align-items-center mt-2'>"
        txt += "               <input type='number'min='1' max='25' onchange='validation()' class='form-control' id='monto' placeholder='Monto'>"
        txt += "           </div>"
        txt += "       </div>"
        txt += "       <div class='row' id='butons'>"
        txt += "           <div class='col d-flex  justify-content-center align-items-center mt-2' id='register1'>"
        txt += "           </div>"
        txt += "           <div class='col d-flex  justify-content-center align-items-center mt-2' id='register2'>"
        txt += "           </div>"
        txt += "       </div>"

        $('.register').append(txt);

        var form = document.getElementById('register1');
        var element1 = document.createElement('input');
        element1.id = "btnGuardar"
        element1.type = 'button';
        element1.name = 'btnGuardar';
        element1.value = 'Guardar';
        element1.className = 'btn btn-dark';
        element1.disabled = true;
        element1.addEventListener('click', addRegister)
        form.appendChild(element1);

        var form2 = document.getElementById('register2');
        var element2 = document.createElement('input');
        element2.type = 'button';
        element2.name = 'btnCancelar';
        element2.value = 'Cancelar';
        element2.className = 'btn btn-dark';
        element2.addEventListener('click', cancelRegister)

        form2.appendChild(element2);


    }, 500)
}

function cancelRegister() {
    removeRegister();
    showSpinner()
    setTimeout(() => {
        removeSpinner()
        var form = document.getElementById('register');
        var element1 = document.createElement('div');
        element1.className = 'alert alert-warning d-flex align-items-center';
        element1.innerHTML = 'Has cancelado un pago. Recarga la página para empezar de nuevo'
        form.appendChild(element1);
    }, 500);

}
function removeRegister() {
    var d = document.getElementById('register');
    var d_nested = document.getElementById('inputs');
    var d_nested2 = document.getElementById('butons');
    d.removeChild(d_nested);
    d.removeChild(d_nested2);
}
function addRegister() {

    var mydate = document.getElementById('date').value;
    var monto = document.getElementById('monto').value;
    var uid = document.getElementById('uid').value;

    $.ajax({
        type: 'POST',
        url: '/addregister',
        data: { mydate: mydate, monto: monto, uid: uid },
        dataType: 'json'                              // <-- add this
        //contentType: 'application/json; charset=utf-8' // <-- remove this
    })
        .done(function (result) {
            removeRegister();

            showSpinner();
            setTimeout(() => {
                removeSpinner()
                var form = document.getElementById('register');
                var element1 = document.createElement('div');
                element1.className = 'alert alert-success d-flex align-items-center';
                element1.innerHTML = 'Has realizado un pago con éxito.'
                form.appendChild(element1);
            }, 500)

        })
        .fail(function (xhr, status, error) {

        })
        .always(function (data) {
        });
}

function validation() {

    var mydate = document.getElementById('date');
    var monto = document.getElementById('monto');
    var btnGuardar = document.getElementById('btnGuardar');

    if (mydate.value == "" || monto.value == "") {
        btnGuardar.disabled = true;
    } else {
        btnGuardar.disabled = false;
    }
    mydate = new Date(mydate.value);

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(
        //mydate.toLocaleDateString("es-ES", options)
    );

}

function showSpinner() {
    var form = document.getElementById('register');
    var element2 = document.createElement('div');
    var element3 = document.createElement('div');
    element2.className = 'spinner-border text-dark';
    element3.className = 'd-flex justify-content-center';
    element3.id = "spinner"
    element3.appendChild(element2)
    form.appendChild(element3);
}

function removeSpinner() {
    var d = document.getElementById('register');
    var d_nested = document.getElementById('spinner');
    d.removeChild(d_nested);
}

function validationpay(idx) {
    let id = idx
    var mydate = document.getElementById('date' + id);
    var monto = document.getElementById('monto' + id);
    var btnUpdate = document.getElementById('btnUpdate' + id);

    if (mydate.value == "" || monto.value == "") {
        btnUpdate.disabled = true;
    } else {
        btnUpdate.disabled = false;
    }

}

function updatepay(idx) {
    let id = idx
    var mydate = document.getElementById('date' + id).value;
    var monto = document.getElementById('monto' + id).value;
    var uid = document.getElementById('uid').value;
    console.log(id, mydate, monto, uid);
    $.ajax({
        type: 'GET',
        url: '/doupdatepay',
        data: { mydate: mydate, monto: monto, uid: uid, idx: id },
        dataType: 'json'                              // <-- add this
        //contentType: 'application/json; charset=utf-8' // <-- remove this
    })
        .done(function (result) {

            var mydiv = document.getElementById('flush-collapse' + id)
            mydiv.innerHTML = ""

            var element2 = document.createElement('div');
            var element3 = document.createElement('div');
            element2.className = 'spinner-border text-dark';
            element3.className = 'd-flex justify-content-center';
            element3.id = "spinner"
            element3.appendChild(element2)
            mydiv.appendChild(element3);
            setTimeout(() => {
                mydiv.innerHTML = ""

                var element1 = document.createElement('div');
                element1.className = 'alert alert-success d-flex align-items-center';
                element1.innerHTML = 'Has actualizado un pago con éxito.'
                mydiv.appendChild(element1);
            }, 500)

        })
        .fail(function (xhr, status, error) {

        })
        .always(function (data) {
        });

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