'use strict';
/*eslint-disable no-console */

const statements=require('./createStatements.json');

try {
  createDatabase(statements);
}
catch(err) {
  console.log(err.message);
}

async function createDatabase(createStatements) {
  const createOptions={
    host:createStatements.host,
    port:createStatements.mysqlport,
    user:createStatements.admin,
    password:createStatements.adminpassword
  };

  //APO: muokkaa tarvittavasti!!

  let dropDatabaseSql=`drop database if exists ${createStatements.database}`;

  //next: createdatabase
  let createDatabaseSql=`create database ${createStatements.database}`;  //creates persondatabase

  let dropUserSql=`drop user if exists '${createStatements.user}'@'${createStatements.host}'`; //saku@localhost

  let createUserSql=`create user if not exists '${createStatements.user}'`+
  `@'${createStatements.host}' identified by '${createStatements.password}'`;

  let grantPrivilegesSql=`grant all privileges on ${createStatements.database}.* ` +
  `to '${createStatements.user}'@'${createStatements.host}'`;

  const Database = require('./databaseDebug');
  let database = new Database(createOptions);

  try{
    await database.doQuery(dropDatabaseSql); //doing a query + waiting until the persondatabase
    //ONLY inside "async"-funtion we can use await
    await database.doQuery(createDatabaseSql);
    if(createStatements.dropuser) {
      await database.doQuery(dropUserSql);
    }
    await database.doQuery(createUserSql);
    await database.doQuery(grantPrivilegesSql);

    database.options.database = createStatements.database;

    for (let newTable of createStatements.tables) {
      let createTable=`create table ${newTable.name} (\n ${newTable.fields.join(',\n')})`;   //note! table (not tables!)
      let insertData = `insert into ${newTable.name} values (?)`;
      await database.doQuery(createTable);  //waiting until the table has been created
      let inserts=[];
      for (let data of newTable.data) {
        inserts.push(database.doQuery(insertData, data));
      }
      await Promise.all(inserts);

    }

  }
  catch(err){
    console.log(err.message);
  }


}
