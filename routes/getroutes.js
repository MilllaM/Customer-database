'use strict';

const routes= require('express').Router();

const initRoutes = function(storage, sendErrorPage) {
  let dataStorage= storage;

  routes.get('/all', (req, res)=> {
    dataStorage.getAll()
      .then(result => res.render('allCustomers', {result:result}))
      .catch(err => sendErrorPage(res, err.message));
  });

  routes.get('/getcustomer', (req, res)=>
    res.render('getCustomer', {title:'Get', header:'Get', action:'/getcustomer' })
  );

  routes.post('/getcustomer', (req, res)=> {
    if(!req.body) {
      res.sendStatus(401);
    }
    else {
      let customerId= req.body.customerId;
      dataStorage.get(customerId)
        .then(customer => res.render('customerPage', {customer}))
        .catch(err => sendErrorPage(res, err.message, 'CustomerError'));
    }
  });

  return routes;
};

module.exports= initRoutes;
