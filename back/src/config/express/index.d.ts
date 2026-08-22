import 'express';

declare global {
    namespace Express{
        interface Request{
            usuario?: {
                id: number,
                tipo: 'dono' | 'cliente'
            };
        }
    }
}