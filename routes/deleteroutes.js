'use strict';

const routes=require('express').Router();

module.exports=(dataStorage,sendErrorPage,sendStatusPage)=>{
  routes.get('/deletecustomer', (req,res)=>
    res.render('getCustomer',{title:'Remove',header:'Remove',action:'/deletecustomer'})
  );

  routes.post('/deletecustomer', (req,res)=>{
    if(!req.body || !req.body.customerId) {
      res.sendStatus(500);
    }
    else{
      dataStorage.delete(req.body.customerId)
        .then(message=>sendStatusPage(res,message))
        .catch(err => sendErrorPage(res,err.message));
    }
  });

  return routes;
};
