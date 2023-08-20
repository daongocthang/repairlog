import { Router } from 'express';
import { uploadFile } from '../middlewares/upload';
import { upload as excelUpload } from '../controllers/excel.controller';
import { findAll } from '../controllers/workorder.controller';

const router = Router();
const routes = (app) => {
    router.post('/upload', uploadFile.single('file'), excelUpload);
    router.get('/', findAll);

    app.use('/api/excel', router);
};

export default routes;
