import { RowDataPacket } from 'mysql2';

//uso para dono
export interface donoBase {
     nome: string;
     telefone: string;
     email: string;
     senha: string;
}

export interface donoLogin extends RowDataPacket {
     id: number;
     senha: string;
}


//uso para quadra
export interface quadraBase {
     nome: string;
     tipo: string;
     duracao_minima_minutos: number;
     preco_periudo: number;
     localizacao_cidade: string;
     localizacao_rua: string;
     abertura: number;
     fechamento: number;
     dias_funcionamento: number;
     dono_id: number;
}

export interface imagem {
     rota: string,
     quadra_id: number
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