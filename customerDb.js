'use strict';

const Database = require('./database');
const sqlStatements = require('./sqlStatements');
const options = require('./options');

//joining all in one string, from sqlStatements.json
const allSql = sqlStatements.getAll.join(' ');
const getCustomerSql = sqlStatements.getCustomer.join(' ');
const insertSql = sqlStatements.insertCustomer.join(' ');
const deleteSql = sqlStatements.deleteCustomer.join(' ');
const updateSql = sqlStatements.updateCustomer.join(' ');

class CustomerDatabase {
  constructor(options, debug=false) {
    //creating a db
    this.customerDb = new Database(options, debug);
  }
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this.customerDb.doQuery(allSql);
        resolve(result);
      }
      catch(err) {
        reject(fatalError(err));
      }
    });
  }

  get(customerId) {
    return new Promise(async (resolve, reject) => {
      try{
        let result = await this.customerDb.doQuery(getCustomerSql, +customerId);
        if(result.length===0) {
          reject(new Error('Ei ollu meiä listoil kettän tommost.'));
        }
        else {
          resolve(result[0]);
        }
      }
      catch(err) {
        reject(fatalError(err));
      }
    });
  }

  insert(customer) {
    return new Promise( async (resolve, reject)=> {
      try{
        let result= await this.customerDb.doQuery(insertSql,
          customer.firstname,
          customer.lastname,
          customer.address,
          customer.favoritIceCream
        );
        if(result.affectedRows===0) {
          reject(new Error('Ei lisätty kettän.'));
        }
        else {
          resolve(`Yks asiakas o nyy lisätty listoil, ID: ${customer.customerId} .`);
        }
      }
      catch(err) {
        reject(fatalError(err));
      }
    });
  }

  delete(customerId) {
    return new Promise (async (resolve, reject)=>{
      try{
        let result= await this.customerDb.doQuery(deleteSql, +customerId);
        if(result.affectedRows===0) {
          reject(new Error(`Ei ol kettän tämmöst, ID: ${customerId}.`));
        }
        else {
          resolve (`Yks asiakas oo nyy otet poies :-(  numero ol ${customerId}.`);
        }
      }
      catch(err) {
        reject(fatalError(err));
      }
    });
  }

  update(customer) {
    return new Promise ( async (resolve, reject) => {
      try {
        let result = await this.customerDb.doQuery(updateSql, customer.firstname,
          customer.lastname, customer.address, customer.favoritIceCream, +customer.customerId);
        if(result.affectedRows === 0) {
          reject(new Error('Ei löytyny mittän tiaroi.'));
        }
        else {
          resolve(`Yhre asiakkaan tiaroi muutetti just. Iiree tais ol: ${customer.customerId}.`);
        }
      }
      catch(err){
        reject(fatalError(err));
      }
    });
  }
} //end of class

module.exports = function initDataStorage(debug=false) {
  return new CustomerDatabase(options, debug);
};

function fatalError(err) {
  return new Error(`Antteks! Meil o joku vika ny tääl. Koitetan korjat noppiaste. Vian koodi: ${err.message}.`);
}
