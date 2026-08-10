import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './src/routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta: ${process.env.PORT}`);
})