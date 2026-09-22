import db from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { donoLogin, donoBase } from '../interfaces/DonoInterface.js';

//GET

const buscarParaLogin = async (email: string) => {
    const [resultado] = await db.query<donoLogin[]>(
        'SELECT id, senha FROM dono WHERE email = ?',
        [email]
    )
    return resultado[0];
}

const agendamentosPendentes = async (dono_id: number) => {
    const [resultado] = await db.query<(RowDataPacket & { id: number, quadra: string, cliente: string, valor_total: number, data_inicio: string, data_fim: string, status: string })[]>(
        `SELECT a.id, q.nome AS quadra_nome, c.nome AS cliente_nome, a.valor_total, a.data_inicio, a.data_fim, a.status FROM agendamento a INNER JOIN quadra q ON a.quadra_id = q.id INNER JOIN cliente c ON a.cliente_id = c.id WHERE a.status IN ('pendente','cancelado','confirmado') AND q.dono_id = ?`,
        [dono_id]
    )
    return resultado;
}

//PUSH

const criarConta = async (dados: donoBase) => {
    const { nome, telefone, email, senha } = dados;
    const [resultado] = await db.query<ResultSetHeader>(
        'INSERT INTO dono VALUES (?, ?, ?, ?, ?)',
        [null, nome, telefone, email, senha]
    )
    return resultado.insertId;
}

//PUT



//DELETE



//EXPORTS

const donoModel = {
    criarConta,
    buscarParaLogin,
    agendamentosPendentes
}

export default donoModel;