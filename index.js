'use strict';

const http = require('http');
const path = require('path');
const express = require('express');

const app = express();
const {host, port, debug} = require('./serverConfig');
//Server creation:
const server = http.createServer(app);

const tietokanta = require('./customerDb')(debug);

const statusHandling= [sendErrorPage, sendStatusPage];

const getroutes= require('./routes/getroutes')(tietokanta,...statusHandling );
const insertroutes= require('./routes/insertroutes')(tietokanta,...statusHandling);
const deleteroutes= require('./routes/deleteroutes')(tietokanta,...statusHandling);
const updateroutes= require('./routes/updateroutes')(tietokanta,...statusHandling );

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', getroutes);
app.use('/', insertroutes);
app.use('/', deleteroutes);
app.use('/', updateroutes);

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'menu.html')));

server.listen(port, host, ()=>
/*eslint-disable no-console */
  console.log(`Server ${host} running at ${port}`)
);

function sendErrorPage(res, message='Error', title='Error', header='Error') {
  sendStatusPage(res, message, title, header);
}

function sendStatusPage(res, message='Status', title='Status', header='Status'){
  return res.render('statusPage',{title:title,header:header,message:message});
}
