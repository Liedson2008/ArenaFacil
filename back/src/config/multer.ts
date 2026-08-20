import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/fotosQuadras');
    },
    filename: (req, file, cb) => {
        const nomeUnico = `${Date.now()}-${file.originalname}`;
        cb(null, nomeUnico);
    },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens JPEG, PNG e GIF sao permitidos'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;