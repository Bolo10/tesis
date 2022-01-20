var islogged = function (req, res, next) {
    if (req.session.loged == undefined) {
        req.session.loged = false
    }
    if (req.session.role == undefined) {
        req.session.role = 'USER_ROLE'
    }
    next()
};

let havepermissions = (req, res, next) => {
    if (req.session.role === 'ADMIN_ROLE') {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = { islogged, havepermissions }