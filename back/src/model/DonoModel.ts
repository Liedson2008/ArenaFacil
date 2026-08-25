import db from '../config/db.js';
import { ResultSetHeader } from 'mysql2';
import { donoLogin, donoBase, quadraBase, imagem } from '../interfaces/DonoInterface.js';

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
        'INSERT INTO quadra(nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento, dono_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento, dono_id]
    )
    return resultado.insertId;
}

const cadastrarImagem = async (rotas: string[], quadra_id: number) => {
    for (const rota of rotas) {
        await db.query('INSERT INTO imagem(rota, quadra_id) VALUES(?, ?)',
            [rota, quadra_id]
        )
    }
}

//PUT



//DELETE



//EXPORTS

const donoModel = {
    criarConta,
    buscarParaLogin,
    cadastrarQuadra,
    cadastrarImagem
}

export default donoModel;