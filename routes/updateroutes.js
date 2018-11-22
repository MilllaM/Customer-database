'use strict';

const routes = require('express').Router();

module.exports = (dataStorage, sendErrorPage, sendStatusPage) => {

  routes.get('/updateform', (req,res)=>  //no curly brackets needed as only one return statement
    res.render('form', {
      title: 'Update customer',
      header: 'Muuta asiakkan tiaroi. Anna ensiks ID numero.',
      action: '/updatedata',
      customerId: {value:'', readonly:''},
      firstname: {value:'', readonly:'readonly'},
      lastname:{value:'', readonly:'readonly'},
      address: {value:'', readonly:'readonly'},
      favoritIceCream: {value:'', readonly:'readonly'}
    })
  );

  routes.post('/updatedata', async (req, res)=> {
    try {
      let customer= await dataStorage.get(req.body.customerId);
      res.render('form',{
        title: 'Update customer',
        header: 'Update customer data',
        action: '/updatecustomer',
        customerId: {value:customer.customerId, readonly:'readonly'},
        firstname: {value: customer.firstname, readonly:''},
        lastname: {value: customer.lastname, readonly: ''},
        address:{value:customer.address, readonly:''},
        favoritIceCream:{value:customer.favoritIceCream, readonly:''}
      });
    }
    catch(err){
      sendErrorPage(res, err.message);
    }
  });

  routes.post('/updatecustomer', (req,res)=> {
    if(!req.body) {
      res.sendStatus(500);
    }
    else {
      dataStorage.update(req.body)
        .then(message=>sendStatusPage(res, message))
        .catch(err=>sendErrorPage(res, err.message));
    }
  });
  return routes;
};
