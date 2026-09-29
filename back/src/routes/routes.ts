import express from 'express';
import upload from '../config/multer.js';
import donoController from '../controller/DonoController.js';
import clienteController from '../controller/ClienteController.js';
import quadraController from '../controller/QuadraController.js';

const route = express.Router();

//ROTAS DONO
route.post('/dono/criar-conta', donoController.criarConta);
route.post('/dono/login', donoController.login);
route.post('/dono/cadastrar-quadra', upload.array('imagens',5), quadraController.cadastrarQuadra)
route.get('/dono/agendamentos', donoController.agendamentos);
route.put('/dono/editar-agendamento/:id', donoController.editarAgendamento);
route.put('/dono/apagar-quadra/:quadra_id', donoController.apagarQuadra)

//ROTAS CLIENTE
route.post('/cliente/criar-conta', clienteController.criarConta);
route.post('/cliente/login', clienteController.login);
route.get('/cliente/home', quadraController.quadrasHomeCliente);
route.post('/cliente/agendar-quadra/:quadra_id', clienteController.agendarQuadra);
route.get('/cliente/buscar', quadraController.buscarPorFiltro);
route.get('/cliente/agendamentos', clienteController.agendamentos);
route.put('/cliente/cancelar-agendamento/:id', clienteController.cancelarAgendamento);


//ROTAS SEM ESPECIFICAÇÂO DE USUARIO


export default route;