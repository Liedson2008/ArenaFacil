import quadraModel from "../model/QuadraModel.js";
import { Request, Response } from 'express';
import { quadraBase, cadastrarQuadraBody } from "../interfaces/QuadraInterface.js";

//GET

const quadrasParaHome = async (req: Request, res: Response) => {
    try {
        const quadras = await quadraModel.aleatorizaçãoQuadras();
        return res.status(200).json(quadras);
    } catch (error) {
        console.error('erro no servidor', error)
        return res.status(500).json({ message: 'erro interno no servidor, porfavor tente novamente mais tarde' })
    }
}

//PUSH

const cadastrarQuadra = async (req: Request<{}, {}, cadastrarQuadraBody>, res: Response) => {
    const { nome, tipo, duracao_minima_minutos, preco_periudo, localizacao_cidade, localizacao_rua, abertura, fechamento, dias_funcionamento } = req.body;
    const dono_id = req.usuario!.id;
    const dados: quadraBase = {
        nome,
        tipo,
        duracao_minima_minutos: Number(duracao_minima_minutos),
        preco_periudo: Number(preco_periudo),
        localizacao_cidade,
        localizacao_rua,
        abertura: abertura,
        fechamento: fechamento,
        dias_funcionamento: dias_funcionamento,
        dono_id: Number(dono_id),
    }
    try {
        const quadra_id = await quadraModel.cadastrarQuadra(dados);
        const imagens = req.files as Express.Multer.File[];

        if (imagens && imagens.length > 0) {
            const rotas = imagens.map((i) => `/uploads/fotosQuadras/${i.filename}`)
            await quadraModel.cadastrarImagem(rotas, Number(quadra_id));
        }

        return res.status(200).json({ message: 'quadra cadastrada com sucesso' })
    } catch (error) {
        console.error('erro no servidor', error)
        return res.status(500).json({ message: 'erro interno no servidor, por favor tente novamente mais tarde' })
    }
}

//PUT

//DELETE

const quadraController = {
    cadastrarQuadra,
    quadrasParaHome
}

export default quadraController;