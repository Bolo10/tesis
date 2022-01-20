function appendRegister() {

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

    var d = document.getElementById('register');
    var d_nested = document.getElementById('anidado');
    var throwawayNode = d.removeChild(d_nested);
}

function cancelRegister() {

    var d = document.getElementById('register');
    var d_nested = document.getElementById('inputs');
    var d_nested2 = document.getElementById('butons');
    var throwawayNode = d.removeChild(d_nested);
    var throwawayNode = d.removeChild(d_nested2);

}
function addRegister() {
    var mydate = document.getElementById('date').value;
    var monto = document.getElementById('monto').value;
    var uid = document.getElementById('uid').value;

    $.ajax({
        type: 'GET',
        url: '/addregister',
        data: { mydate: mydate, monto: monto, uid: uid },
        dataType: 'json'                              // <-- add this
        //contentType: 'application/json; charset=utf-8' // <-- remove this
    })
        .done(function (result) {
            console.log(result)

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

    mydate = new Date(mydate.value);


    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(
        //mydate.toLocaleDateString("es-ES", options)
    );

    if (mydate.value == "" || monto.value == "") {
        console.log('sinvalores')

    } else {
        btnGuardar.disabled = false;
    }

}