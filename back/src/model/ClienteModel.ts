import db from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { clienteBase, clienteLogin, agendamentoQuadra } from '../interfaces/ClienteInterface.js';
import dayjs from 'dayjs';

//GET

const buscarParaLogin = async (email: string) => {
    const [resultado] = await db.query<clienteLogin[]>(
        'SELECT id, senha FROM cliente WHERE email = ?',
        [email]
    );
    return resultado[0];
}

const verificarConflito = async (quadra_id: number, data_inicio: string, data_fim: string) => {
    const [resultado] = await db.query<(RowDataPacket & {id: number})[]>(
        'SELECT id FROM agendamento WHERE quadra_id = ? AND data_inicio <= ? AND data_fim >= ?',
        [quadra_id, data_fim, data_inicio]
    )
    return resultado.length > 0;
}

const agendamentos = async (cliente_id: number, status: string[]) => {
    const [resultado] = await db.query<(RowDataPacket & { id: number, quadra_nome: string, dono_nome: string, valor_total: number, data_inicio: string, data_fim: string, status: string })[]>(
        `SELECT a.id, q.nome AS quadra_nome, d.nome AS dono_nome, a.valor_total, a.data_inicio, a.data_fim, a.status FROM agendamento a INNER JOIN quadra q ON a.quadra_id = q.id INNER JOIN dono d ON q.dono_id = d.id WHERE a.status IN (?) AND a.cliente_id = ?`,
        [status, cliente_id]
    )
    return resultado;
}

//PUSH

const agendarQuadra = async (dados: agendamentoQuadra) => {
    const { quadra_id, cliente_id, valor_total, data_inicio, data_fim } = dados;
    const [resultado] = await db.query<ResultSetHeader>(
        'INSERT INTO agendamento(quadra_id, cliente_id, valor_total, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?)',
        [quadra_id, cliente_id, valor_total, data_inicio, data_fim]
    )
    return resultado.insertId;
} 

const criarConta = async (dados: clienteBase) => {
    const { nome, telefone, email, senha } = dados;
    const [resultado] = await db.query<ResultSetHeader>(
        'INSERT INTO cliente VALUES (?, ?, ?, ?, ?)',
        [null, nome, telefone, email, senha]
    )
    return resultado.insertId;
}


//PUT

const cancelarAgendamento = async (agendamento_id: number) => {
    const data_cancelamento = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const [ resultado ] = await db.query<ResultSetHeader>(
        `UPDATE agendamento SET status = 'cancelado', cancelador = 'cliente', data_cancelamento = ? WHERE id = ?`,
        [data_cancelamento, agendamento_id]
    )
    return resultado.affectedRows
}

//DELETE





const clienteModel = {
    criarConta,
    buscarParaLogin,
    agendarQuadra,
    verificarConflito,
    agendamentos,
    cancelarAgendamento
}
export default clienteModel;