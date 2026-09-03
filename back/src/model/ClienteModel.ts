import db from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { clienteBase, clienteLogin, agendamentoQuadra } from '../interfaces/ClienteInterface.js';

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



//DELETE





const clienteModel = {
    criarConta,
    buscarParaLogin,
    agendarQuadra,
    verificarConflito
}
export default clienteModel;