
function addchange(elemento, atributo) {

    if (atributo == 'email') {
        if (!document.getElementById("inputEmail").validity.valid) {
            return
        }
    }

    mya(elemento, atributo)

}
function mya(elemento, atributo) {
    var uid = document.getElementById('uid').value
    console.log(uid);
    let data
    if (atributo == 'sexo') {
        data = elemento
    } else {
        data = document.getElementById(elemento).value
    }
    console.log(data);
    $.ajax({
        credentials: 'same-origin',
        type: 'POST',
        url: '/change',
        data: { data: data, atr: atributo, uid },
        dataType: 'json'

    })
        .done(function (result) {
            if (result.sexo) {
                $("#check1").prop('disabled', true);
                $("#check2").prop('disabled', true);

                document.getElementById("checkOK").style.display = 'none'
                document.getElementById("checkC").style.display = 'block'
                $('.uno').toast('show');
            } else {
                if (elemento == 'inputPos') {
                    $("#inputPos").prop('disabled', true);
                } else if (elemento == 'inputHor') {
                    $("#inputHor").prop('disabled', true);
                }
                document.getElementById(elemento + "OK").style.display = 'none'
                document.getElementById(elemento + "C").style.display = 'block'
                $("#" + elemento).prop('readonly', true);
                $('.uno').toast('show');
            }


        })
        .fail(function (xhr, status, error) {
        })
        .always(function (data) {
        });
}
function sendgender() {
    var radios = document.getElementsByName('gender');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio

            mya(radios[i].value, 'sexo')
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
}

function changepass() {
    if (document.getElementById('inputPassword').value == document.getElementById('inputCPassword').value && document.getElementById("inputPassword").validity.valid && document.getElementById("apassword").validity.valid) {
        $.ajax({
            credentials: 'same-origin',
            type: 'POST',
            url: '/change',
            data: { apassword: document.getElementById('apassword').value, atr: 'password', npassword: document.getElementById('inputPassword').value },
            dataType: 'json'                              // <-- add this
            //contentType: 'application/json; charset=utf-8' // <-- remove this
        })
            .done(function (result) {
                if (result.ok) {
                    document.getElementById('cpass').innerHTML = '<h3>Contraseña Cambiada</h3>'
                } else {
                    document.getElementById('apassword').value = ''
                    document.getElementById('actual').innerHTML = 'Vuelva a introducir la Contraseña'
                    document.getElementById('actual').style.color = 'red'
                }
            })
            .fail(function (xhr, status, error) {
            })
            .always(function (data) {
            });
    } else {
        //document.getElementById('confmsg').innerHTML= 'Las contraseñas no coinciden'
    }
}
function editar(id) {
    $("#" + id).prop('readonly', false);
    //document.getElementById(id).classList.remove("form-control-plaintext")
    document.getElementById(id).classList.add("form-control")
    document.getElementById(id + "OK").style.display = 'block'
    document.getElementById(id + "C").style.display = 'none'

    //inputNameOK
    //form-control-plaintext
}
function editarselect(id) {
    $("#" + id).prop('disabled', false);
    document.getElementById(id).classList.add("form-control")
    document.getElementById(id + "OK").style.display = 'block'
    document.getElementById(id + "C").style.display = 'none'

}
function editarcheck(id1, id2, id) {
    $("#" + id1).prop('disabled', false);
    $("#" + id2).prop('disabled', false);

    document.getElementById(id + "OK").style.display = 'block'
    document.getElementById(id + "C").style.display = 'none'
    $('input[type="radio"]').on('change', function () {
        $('input[type="radio"]').not(this).prop('checked', false);
    });

}
function dpass() {
    document.getElementById('cpass').style.display = 'block'
    document.getElementById('bpass').style.display = 'none'
}
function alphaOnly(event) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || key == 8 || key == 9 || key == 32);
};
function alphanumericOnly(event) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || key == 8 || key == 9 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
};
function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    // alert("You have entered an invalid email address!")
    return (false)
}
$(document).ready(function () {
    $("#inputEmail").on('keyup blur', function () {
        emailb = ValidateEmail(document.getElementById("inputEmail").value)
        if (emailb) {
            $.ajax({
                type: 'GET',
                url: '/emails',
                data: { emailt: document.getElementById("inputEmail").value },
                dataType: 'json'                              // <-- add this
                //contentType: 'application/json; charset=utf-8' // <-- remove this
            })
                .done(function (result) {
                    if (result.exist && document.getElementById('inputEmail').value != document.getElementById("emailp").value) {
                        document.getElementById("emailver").innerHTML = '<span style="color: red;">Email ya registrado</span>'
                        document.getElementById("inputEmail").setCustomValidity('El correo ya está resgistrado');
                    } else {
                        document.getElementById("emailver").innerHTML = '<span style="color: green;">Email disponible</span>'
                        document.getElementById("inputEmail").setCustomValidity('');
                    }
                })
                .fail(function (xhr, status, error) {
                })
                .always(function (data) {
                });
        } else {
            document.getElementById("emailver").innerHTML = '<span style="color: red;">Email Inválido</span>'
        }
    });
});
