import { RowDataPacket } from 'mysql2';

export interface clienteBase {
    nome: string;
    telefone: string;
    email: string;
    senha: string;
}

export interface clienteLogin extends RowDataPacket {
    id: number;
    senha: string;
}

export interface agendamentoQuadra {
    quadra_id: number;
    cliente_id: number;
    valor_total: number;
    data_inicio: string;
    data_fim: string;
}