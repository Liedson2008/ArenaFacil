import { RowDataPacket } from 'mysql2';

export interface quadraBase {
     nome: string;
     tipo: string;
     duracao_minima_minutos: number;
     preco_periudo: number;
     localizacao_cidade: string;
     localizacao_rua: string;
     abertura: string;
     fechamento: string;
     dias_funcionamento: string;
     dono_id: number;
}

export interface cadastrarQuadraBody {
     nome: string;
     tipo: string;
     duracao_minima_minutos: string;
     preco_periudo: string;
     localizacao_cidade: string;
     localizacao_rua: string;
     abertura: string;
     fechamento: string;
     dias_funcionamento: string;
     dono_id: string;
}

export interface quadraCompleta extends quadraBase, RowDataPacket {
    id:number
}

export interface buscarPorId extends quadraBase, RowDataPacket {}