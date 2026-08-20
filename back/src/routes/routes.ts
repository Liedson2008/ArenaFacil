import express from 'express';
import donoController from '../controller/DonoController.js';
import clienteController from '../controller/ClienteController.js';

const route = express.Router();

//ROTAS DONO
route.post('/dono/criar-conta', donoController.criarConta);
route.post('/dono/login', donoController.login);


//ROTAS CLIENTE
route.post('/cliente/criar-conta', clienteController.criarConta);
route.post('/cliente/login', clienteController.login);


//ROTAS SEM DEFINIÇÂO

export default route;