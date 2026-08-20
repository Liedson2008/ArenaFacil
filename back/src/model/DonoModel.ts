import db from '../config/db.js';
import { ResultSetHeader } from 'mysql2';
import { donoLogin, donoBase, quadraBase } from '../interfaces/DonoInterface.js';

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

const cadastrarQuadra = async (dados: quadraBase) => {
    const { nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento, dono_id } = dados;
    const [resultado] = await db.query<ResultSetHeader>(
        'INSERT INTO quadra VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [null, nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento, dono_id]
    )
    return resultado.insertId;
}

//PUT



//DELETE



//EXPORTS

const donoModel = {
    criarConta,
    buscarParaLogin,
    cadastrarQuadra
}

export default donoModel;