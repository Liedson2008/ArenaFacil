import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './src/routes/routes.js';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const rotaFotos = 'uploads/fotosQuadras';
if (!fs.existsSync(rotaFotos)) {
    fs.mkdirSync(rotaFotos, { recursive: true });
}

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta: ${process.env.PORT}`);
})