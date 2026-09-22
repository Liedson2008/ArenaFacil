import donoModel from '../model/DonoModel.js'
import { Request, Response } from 'express';
import { donoBase } from '../interfaces/DonoInterface.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//GET

const login = async (req: Request<{}, {}, { email: string; senha: string }>, res: Response) => {
    const { email, senha } = req.body;
    try {
        const dadosDono = await donoModel.buscarParaLogin(email);
        if (!dadosDono) {
            return res.status(401).json({ message: 'email ou senha incorretos' });
        }
        const senhaCorreta = await bcrypt.compare(senha, dadosDono.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'email ou senha incorretos' });
        }
        const token = jwt.sign({ id: dadosDono.id, tipo: 'dono' }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        return res.status(200).json({ message: 'login efetuado com sucesso', token, data: { id: dadosDono.id, tipo: 'dono' } });
    } catch (error) {
        console.log('erro no servidor', error);
        return res.status(500).json({ message: 'erro no servidor, por favor tente novamente mais tarde' });
    }
}

const agendamentosPendentes = async (req: Request, res: Response) => {
    const dono_id = 1;
    try {
        const agendamentos = await donoModel.agendamentosPendentes(dono_id);
        return res.status(200).json(agendamentos);
    } catch (error) {
        console.error('erro no servidor', error);
        return res.status(500).json({ menssage: 'erro no servidor tente novamente masi tarde' });
    }
}

//PUSH

const criarConta = async (req: Request<{}, {}, donoBase>, res: Response) => {
    const { senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const dados = { ...req.body, senha: senhaCriptografada };
    try {
        const id = await donoModel.criarConta(dados);
        return res.status(201).json({ message: 'Dono cadastrado com sucesso' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'email informado ja esta em uso, por favor informe outro email' });
        }
        console.log('error no servidor', error);
        return res.status(500).json({ message: 'erro no servidor, por favor tente novamente mais tarde' });
    }
}


//PUT

//DELETE

//EXPORTS

const donoController = {
    criarConta,
    login,
    agendamentosPendentes
}
export default donoController;