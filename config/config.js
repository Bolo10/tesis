//======================
// PUERtO
//======================
process.env.PORT = process.env.PORT || 3000

//======================
// ENtorno
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=======================
// BASE DE DATOS
//=======================
/*
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/productos'
    
} else {
    // urlDB = `mongodb+srv://${user}:${password}@cafe.xcifs.mongodb.net/test`
    //urlDB = 'mongodb+srv://cafeAdmin:admincafe123@cafe.xcifs.mongodb.net/test'
    urlDB = 'mongodb+srv://adminproductos:productosadmin@productos.g7dhp.mongodb.net/productos'

}
*/
//DATABASE
urlDB = 'mongodb+srv://adminvoucher:voucheradmin@voucher.9bpcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
process.env.URLDB = urlDB;



//=======================
// MAIL
//=======================
process.env.MAIL = 'erick.tapia850@gmail.com'
process.env.PASSWORD = 'Guitarramorty10new!'

//=================
// KEY OF SESSION
//=================

process.env.KEY = 'TESISdecimonivel'