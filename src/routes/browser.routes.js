import { Router } from 'express';
import R from '../R';

const router = Router();

export const BrowserRoutes = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/hom-nay');
    });
    app.get('/:slug', (req, res) => {
        const { slug } = req.params;
        const baseURL = '/api/v1';
        res.render('pages/index', {
            dataTable: baseURL + '/data/' + slug,
            status: R.status,
            baseURL,
        });
    });

    app.use('/', router);
};
