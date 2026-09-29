import db from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { donoLogin, donoBase } from '../interfaces/DonoInterface.js';
import dayjs from 'dayjs';

//GET

const buscarParaLogin = async (email: string) => {
    const [resultado] = await db.query<donoLogin[]>(
        'SELECT id, senha FROM dono WHERE email = ?',
        [email]
    )
    return resultado[0];
}

const agendamentos = async (dono_id: number, status: string[]) => {
    const [resultado] = await db.query<(RowDataPacket & { id: number, quadra: string, cliente: string, valor_total: number, data_inicio: string, data_fim: string, status: string })[]>(
        `SELECT a.id, q.nome AS quadra_nome, c.nome AS cliente_nome, a.valor_total, a.data_inicio, a.data_fim, a.status FROM agendamento a INNER JOIN quadra q ON a.quadra_id = q.id INNER JOIN cliente c ON a.cliente_id = c.id WHERE a.status IN (?) AND q.dono_id = ?`,
        [status,dono_id]
    )
    return resultado;
}

const verificarParaDelete = async (status: string[], quadra_id: number) => {
    const [resultado] = await db.query<(RowDataPacket & { id: number })[]>(
        `SELECT id FROM agendamento WHERE status IN (?) AND quadra_id = ?`,
        [status, quadra_id]
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

const editarAgendamento = async (id: number, status: string) => {
    const [resultado] = await db.query<ResultSetHeader>(
        `UPDATE agendamento SET status = ? WHERE id = ?`,
        [status, id]
    )
    return resultado.affectedRows;
}

const cancelarAgendamento = async (id: number) => {
    const dataAtual = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const [resultado] = await db.query<ResultSetHeader>(
        `UPDATE agendamento SET status = 'cancelado', cancelador = 'dono', data_cancelamento = ? WHERE id = ?`,
        [dataAtual, id]
    )
    return resultado.affectedRows;
}

//DELETE

const apagarQuadra = async (quadra_id: number, dono_id: number) => {
    const [ resultado ] = await db.query<ResultSetHeader>(
        'UPDATE quadra SET ativo = false WHERE id = ? AND dono_id = ?',
        [quadra_id, dono_id]
    )
    return resultado.affectedRows;
}

//EXPORTS

const donoModel = {
    criarConta,
    buscarParaLogin,
    agendamentos,
    editarAgendamento,
    cancelarAgendamento,
    apagarQuadra,
    verificarParaDelete
}

export default donoModel;