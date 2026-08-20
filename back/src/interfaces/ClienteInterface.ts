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