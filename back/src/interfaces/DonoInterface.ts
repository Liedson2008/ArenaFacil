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