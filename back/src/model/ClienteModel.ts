import db from '../config/db.js';
import { ResultSetHeader } from 'mysql2';
import { clienteBase, clienteLogin } from '../interfaces/ClienteInterface.js';

//GET

const buscarParaLogin = async (email: string) => {
    const [resultado] = await db.query<clienteLogin[]>(
        'SELECT id, senha FROM cliente WHERE email = ?',
        [email]
    );
    return resultado[0];
}


//PUSH

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
    buscarParaLogin
}
export default clienteModel;