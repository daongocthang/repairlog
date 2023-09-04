import { Router } from 'express';
import { uploadFile } from '../middlewares/upload';
import { upload as excelUpload } from '../controllers/excel.controller';
import { findFromToday, fetchDataStats, findBySlug, bulkChangeStatus } from '../controllers/workorder.controller';

const router = Router();
export const useApiRoutes = (app) => {
    router.post('/upload', uploadFile.single('file'), excelUpload);
    router.post('/upload/:field', uploadFile.single('file'), excelUpload);

    router.post('/status/:slug', bulkChangeStatus);

    router.get('/order');
    router.post('/order');
    router.put('/order/:pk');
    router.delete('/order/:pk');

    router.get('/stats', fetchDataStats);
    router.get('/data', findFromToday);
    router.get('/data/:slug', findBySlug);

    app.use('/api/v1/', router);
};
