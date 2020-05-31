const { Router } = require('express');
const router = Router();

const conn = require('../database/MySQL');

//show tables
router.get('/', (_req, res) => {
    conn.query('SHOW TABLES', (err, rows) => {
        if(!err) {
            res.status(200).json({tables:rows.map((val)=>Object.values(val)[0])});
        } else {
            error(err,res);
        }
    });
});

//custom query
router.get('/query/:sql',(req,res)=>{
    conn.query(req.params.sql,(err,rows)=>{
        if (!err) {
            res.status(200).json(rows);
        } else {
            error(err,res);
        }
    });
})

//select table
router.get('/:table/:where',(req,res)=>{
    //check if where
    const where = (req.params.where!=null)?" where "+req.params.where:"";
    conn.query('SELECT * FROM '+req.params.table+where,(err,rows,fields)=>{
        if (!err) {

            res.status(200).json(rows);
        } else {
            error(err,res);
        }
    });
});

//insert
router.post('/:table',(req,res)=>{
const column = Object.keys(req.body);
const where = [];
const values = Object.values(req.body).map((val,i)=>{
    const value ="'"+val+"'"; 
    where.push("`"+column[i]+"`="+value);
    return value;
});
const query = "INSERT INTO "+req.params.table+" ("+column.join(",")+") VALUES ("+values.join(",")+")";
conn.query(query,(err)=>{
    if (!err) {
        conn.query("SELECT * FROM "+req.params.table+" where "+where.join(" and "),(err,rows)=>{
            if (!err) {
                res.status(200).json(rows);
            } else {
                error(err,res);                
            }
        });
    } else {
        error(err,res);
    }
});
});


//update
router.put('/:table',(req,res)=>{
const where = req.body.where;
const update =[];
const column = Object.keys(req.body.data);
const values = Object.values(req.body.data).map((val,i)=>{
    const value= "'"+val+"'";
    update.push("`"+column[i]+"`="+value);
    return value;
});
conn.query("UPDATE "+req.params.table+" SET "+update.join(",")+" WHERE "+ where,(err)=>{
if (!err) {
    conn.query("SELECT * FROM "+req.params.table+" WHERE "+where,(err,rows)=>{
        if (!err) {
            res.status(200).json(rows);
        } else {
            error(err,res);
        }
    });
} else {
    error(err,res);
}
});

});


//delete
router.delete('/:table/:where',(req,res)=>{
const where = req.params.where;
conn.query("DELETE FROM "+req.params.table+" WHERE "+where,(err,rows)=>{
    if (!err) {
        res.status(200).send("deleted "+rows.affectedRows+" rows sucessfully ");
    } else {
        error(err,res);
    }
});
});




//error
function error(e,res) {
    res.status(403).json(e);
}



module.exports = router;
