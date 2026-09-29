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

const agendamentos = async (req: Request, res: Response) => {
    const dono_id = req.usuario!.id;
    const { status } = req.query;
    const arrayStatus = Array.isArray(status) ? status : ( status ? [status] : ['pendente', 'confirmado', 'cancelado', 'finalizado'])
    try {
        const agendamentos = await donoModel.agendamentos(dono_id, arrayStatus as string[]);
        return res.status(200).json(agendamentos);
    } catch (error) {
        console.error('erro no servidor', error);
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


//PUT

const editarAgendamento = async (req: Request<{ id: string }, {}, { status: string, statusAtual: string }>, res: Response) => {
    const { id } = req.params;
    const { status, statusAtual } = req.body;
    if(statusAtual === 'finalizado') {
        return res.status(401).json({message: 'nao e possivel alterar um agendamento finalizado'})
    }
    try {
        if (status !== 'confirmado' && status !== 'cancelado' && status !== 'finalizado') {
            return res.status(400).json({ message: 'status informado para a alteração do agendamento é invalido, envie um satatus valido' });
        }
        if (status === 'confirmado') {
            const linhasAfetatdas = await donoModel.editarAgendamento(Number(id), status);
            if (linhasAfetatdas < 1) {
                return res.status(404).json({ message: 'agendamento nao encontrado' });
            }
            return res.status(200).json({ message: 'agendamento confirmado com sucesso' });
        }
        if (status === 'finalizado') {
            const linhasAfetadas = await donoModel.editarAgendamento(Number(id), status);
            if(linhasAfetadas < 1) {
               return res.status(404).json({ message: 'agendamento nao encontrado' });
            }
             return res.status(200).json({ message: 'agendamento finalizado com sucesso' });
        }
        if (status === 'cancelado') {
            const linhasAfetadas = await donoModel.cancelarAgendamento(Number(id));
            if (linhasAfetadas < 1) {
                return res.status(404).json({ message: 'agendamento nao encontrado' });
            }
            return res.status(200).json({ message: 'agendamento cancelado com sucesso' });
        }

    }catch (error) {
        console.error('erro no servidor', error);
        return res.status(500).json({ message: 'erro no servidor, por favor tente novamente mais tarde' });
    }
}

//DELETE

const apagarQuadra = async (req: Request<{quadra_id: string}, {}, {}>, res: Response) => {
    const { quadra_id } = req.params;
    const dono_id = req.usuario!.id;
    const status = ["confirmado", "pendente"]
    const agendamentos = await donoModel.verificarParaDelete(status as string[], Number(quadra_id))
    if(agendamentos.length > 0) {
        return res.status(400).json({ message: 'nao e possivel apagar uma quadra que tenha agendamentos pendentes' })
    }
    const linhasAfetadas = await donoModel.apagarQuadra(Number(quadra_id), dono_id)
    if(linhasAfetadas < 1) {
        return res.status(404).json({ message: 'quadra nao encontra' })
    }
    return res.status(200).json({ message: 'quadra apagada com sucesso'})
} 

//EXPORTS

const donoController = {
    criarConta,
    login,
    agendamentos,
    editarAgendamento,
    apagarQuadra
}
export default donoController;