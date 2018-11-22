'use strict';

const Database =require('./database');
const sqlStatements=require('./sqlStatements');

const customerDb=new Database({
  host:'localhost',
  port:3306,
  user:'ella',
  password:'UNcUd49J',
  database:'customerdb'
}, true);

const allSql=sqlStatements.getAllSql.join(' ');

customerDb.doQuery(allSql)
  .then(result=>console.log(result))
  .catch(err=>console.log(err.message));
