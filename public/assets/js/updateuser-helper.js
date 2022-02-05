
var confmsg = document.getElementById("confmsg")
var letter = document.getElementById("letter");

var form = document.getElementById("registerform")


// When the user starts to type something inside the password field



function rolec() {
    var selected = document.getElementById("role").selectedIndex
    console.log(selected);
    if (selected == 0) {
        document.getElementById("role").setCustomValidity('Elija un role para el usuario');
    } else {
        document.getElementById("role").setCustomValidity('');
    }
}

function submitvalidate() {

    var selected = document.getElementById("role").selectedIndex
    console.log(selected);
    if (selected != 0) {
        document.getElementById("role").setCustomValidity('');
        return true
    } else {
        if (selected == 0) {
            document.getElementById("role").setCustomValidity('Elija un role para el usuario');
        } else {
            document.getElementById("role").setCustomValidity('');
        }
        return false
    }
}