import { Router } from 'express';
import { uploadFile } from '../middlewares/upload';
import { upload as excelUpload } from '../controllers/excel.controller';
import { order, clouds } from '../controllers';

import db from '../models';

const router = Router();
export const MainRoutes = (app) => {
    router.post('/import/:type', uploadFile.single('file'), excelUpload);

    router.get('/data/:slug', order.findBySlug);
    router.post('/order', order.create);
    router.put('/order/update', order.updateByPk);
    router.put('/order/status/:status', order.bulkChangeStatus);
    router.delete('/order', order.removeAllSelections);

    router.get('/clouds', clouds);

    router.get('/view/:name', async (req, res) => {
        const { name } = req.params;
        const methods = await db.Method.findAll();

        res.render('templates/forms/' + name, { methods: methods });
    });   

    app.use('/api/v1/', router);
};