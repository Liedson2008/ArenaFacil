import db from "../config/db.js";
import { quadraBase, quadraCompleta, buscarPorId } from "../interfaces/QuadraInterface.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//GET

const aleatorizaçãoQuadras = async () => {
    const [idsRows] = await db.query<(RowDataPacket & { id: number })[]>(
        'SELECT id FROM quadra'
    )

    const todosIds = idsRows.map(row => row.id)

    function shuffle(array: number[]) {
        const arr = [...array]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[j], arr[i] = arr[i], arr[j]]
        }
        return arr;
    }

    const idsSorteados = shuffle(todosIds).slice(0, 10)

    const [quadrasSorteadas] = await db.query<quadraCompleta[]>(
        'SELECT id, nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento, dono_id FROM quadra WHERE id IN (?)',
        [idsSorteados]
    )

    return quadrasSorteadas;
}

const buscarQuadra = async (id: number) => {
    const [resultado] = await db.query<buscarPorId[]>(
        'SELECT nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento, dono_id FROM quadra WHERE id = ?',
        [id]
    )
    return resultado[0];
}
//PUSH

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

const quadraModel = {
    cadastrarImagem,
    cadastrarQuadra,
    aleatorizaçãoQuadras,
    buscarQuadra
}

export default quadraModel;