//TODO: change your config

const mysql = require ('mysql');


const conn = mysql.createConnection({
host:"localhost",
user: "karim",
password:"",
database:"sakila"
});

conn.connect((err)=>{
    if (err) {
        console.log(err);
    } else {
        console.log("database connected");
    }
});


module.exports=conn;