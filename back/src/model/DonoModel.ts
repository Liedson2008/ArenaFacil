import db from '../config/db.js';
import { ResultSetHeader } from 'mysql2';
import { donoLogin, donoBase } from '../interfaces/DonoInterface.js';

//GET

const buscarParaLogin = async (email: string) => {
    const [resultado] = await db.query<donoLogin[]>(
        'SELECT id, senha FROM dono WHERE email = ?',
        [email]
    )
    return resultado[0];
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
    buscarParaLogin
}

export default donoModel;