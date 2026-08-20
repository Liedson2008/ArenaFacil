import clienteModel from "../model/ClienteModel.js";
import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";
import { Request, Response } from 'express';
import { clienteBase } from '../interfaces/ClienteInterface.js';


//GET

const login = async (req: Request<{}, {}, { email: string, senha: string }>, res: Response) => {
    const { email, senha } = req.body;
    try {
        const dadosCliente = await clienteModel.buscarParaLogin(email);
        if (!dadosCliente) {
            return res.status(401).json({ message: 'email ou senha incorretos' })
        }
        const senhaCorreta = await bycrypt.compare(senha, dadosCliente.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'email ou senha incorretos' })
        }
        const token = jwt.sign({ id: dadosCliente.id, tipo: 'cliente' }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        return res.status(200).json({ message: 'login efetuado com sucesso', token, data: { id: dadosCliente.id, tipo: 'cliente' } });
    } catch (error) {
        console.log('erro no servidor', error);
        return res.status(500).json({ message: 'erro no servidor, por favor tente novamente mais tarde' });
    }
}

//PUSH

const criarConta = async (req: Request<{}, {}, clienteBase>, res: Response) => {
    const { senha } = req.body;
    const senhaCriptografada = await bycrypt.hash(senha, 10);
    const dados = { ...req.body, senha: senhaCriptografada };
    try {
        const id = await clienteModel.criarConta(dados);
        return res.status(200).json({ message: 'conta criada com sucesso' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'email informado ja esta em uso, porfavor informe outro email' });
        }
        console.log('errro no servidor', error);
        return res.status(500).json({ message: 'erro no servidor, porfavor tente novamente mais tarde' });
    }
}

//PUT


//DELETE



const clienteController = {
    criarConta,
    login
}
export default clienteController;