import donoModel from '../model/DonoModel.js'
import { Request, Response } from 'express';
import { donoBase, cadastrarQuadraBody, quadraBase } from '../interfaces/DonoInterface.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

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

const cadastrarQuadra = async (req: Request<{}, {}, cadastrarQuadraBody>, res: Response) => {
    const { nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento } = req.body;
    const dono_id = 1
    const dados: quadraBase = {
        nome,
        tipo,
        duracao_minima_minutos: Number(duracao_minima_minutos),
        preco_periudo: Number(preco_periudo),
        localizacao_cidade,
        localizacao_rua,
        abertura: abertura,
        fechamento: fechamento,
        dias_funcionamento: dias_funcionamento,
        dono_id: Number(dono_id),
    }
    try {
        const quadra_id = await donoModel.cadastrarQuadra(dados);
        const imagens = req.files as Express.Multer.File[];

        if (imagens && imagens.length > 0) {
            const rotas = imagens.map((i) => `/uploads/fotosQuadra/${i.filename}`)
            await donoModel.cadastrarImagem(rotas, Number(quadra_id));
        }

        return res.status(200).json({ message: 'quadra cadastrada com sucesso' })
    } catch (error) {
        console.error('erro no servidor', error)
        return res.status(500).json({ message: 'erro interno no servidor, por favor tente novamente mais tarde' })
    }
}
//PUT

//DELETE

//EXPORTS

const donoController = {
    criarConta,
    login,
    cadastrarQuadra
}
export default donoController;