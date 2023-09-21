import { Router } from 'express';
import { uploadFile } from '../middlewares/upload';
import { upload as excelUpload } from '../controllers/excel.controller';
import { findFromToday, fetchDataStats, findBySlug, bulkChangeStatus } from '../controllers/workorder.controller';
import db from '../models';

const router = Router();
export const MainRoutes = (app) => {
    router.post('/import', uploadFile.single('file'), excelUpload);
    router.post('/import/:field', uploadFile.single('file'), excelUpload);

    router.post('/status/:slug', bulkChangeStatus);

    router.get('/order');
    router.post('/order');
    router.put('/order/:pk');
    router.delete('/order/:pk');

    router.get('/clouds', fetchDataStats);
    router.get('/data', findFromToday);
    router.get('/data/:slug', findBySlug);

    router.get('/view/:name', async (req, res) => {
        const { name } = req.params;
        const methods = await db.Method.findAll();

        res.render('templates/forms/' + name, { methods: methods });
    });

    app.use('/api/v1/', router);
};
