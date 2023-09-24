import { Router } from 'express';
import R from '../R';

const router = Router();

export const BrowserRoutes = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/hom-nay');
    });
    app.get('/:slug', (req, res) => {
        let { slug } = req.params;
        res.render('pages/index', {
            dataTable: '/api/v1/data/' + slug,
            status: R.status,
        });
    });

    app.use('/', router);
};
