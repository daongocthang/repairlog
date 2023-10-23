import { Router } from 'express';
import R from '../R';
import url from 'url';

const router = Router();

export default (app) => {
    router.get('/', (req, res) => {
        res.redirect('/clouds/hom-nay');
    });
    router.get('/clouds/:slug', (req, res) => {
        const { slug } = req.params;
        const baseURL = '/api/v1';
        res.render('pages/index', {
            dataTable: baseURL + '/order/slug/' + slug,
            status: R.status,
            baseURL,
        });
    });

    router.get('/search', (req, res) => {
        const Url = req._parsedUrl;
        const baseURL = '/api/v1';
        res.render('pages/index', {
            dataTable: baseURL + '/order/search/' + Url.search,
            status: R.status,
            baseURL,
        });
    });

    app.use('/', router);
};
