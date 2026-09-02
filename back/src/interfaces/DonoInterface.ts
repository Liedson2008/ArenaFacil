import { RowDataPacket } from 'mysql2';


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





