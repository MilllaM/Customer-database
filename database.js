'use strict';

const mysql=require('mysql');

module.exports=class Database{
  constructor(options) {
    this.options=options;
  }

  doQuery(sql, ...parameters) { //data for the question marks
    return new Promise((resolve, reject)=> {  //this callback will be called when everything is readyy
      let connection=mysql.createConnection(this.options);
      let sqlStatement = connection.query(sql, [...parameters], (err, result)=> {
        if(err) {
          reject(new Error('SQL Error: '+err));
        }
        resolve(result);
      });
      connection.end();
    });
  }
};
