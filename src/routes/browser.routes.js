import { Router } from 'express';
import { createDataStatuses } from '../config';

const router = Router();

export const BrowserRoutes = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/hom-nay');
    });
    app.get('/:slug', (req, res) => {
        let { slug } = req.params;
        res.render('pages/index', {
            dataTable: '/api/v1/data/' + slug,
            statuses: ['đang sửa', 'chờ trả', 'kết thúc'],
        });
    });

    app.use('/', router);
};
