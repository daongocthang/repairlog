import { Router } from 'express';
import { createDataStatuses } from '../config';

const router = Router();

export const useBrowserRoutes = (app) => {
    app.get('/', (req, res) => {
        res.render('pages/', { url: '/api/v1/data', statuses: createDataStatuses() });
    });

    app.get('/:slug', (req, res) => {
        let { slug } = req.params;
        res.render('pages/index', { url: '/api/v1/data/' + slug, statuses: createDataStatuses() });
    });

    app.get('/upload/:field', (req, res) => {
        let { field } = req.params;
        res.render('pages/upload', { url: '/api/v1/upload/' + (field === 'today' ? '' : field) });
    });

    app.use('/', router);
};
