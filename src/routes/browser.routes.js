import { Router } from 'express';
import { createDataStatuses } from '../config';

const router = Router();

const baseurl = '/api/v1/';

export const BrowserRoutes = (app) => {
    app.get('/:slug', (req, res) => {
        let { slug } = req.params;
        if (slug == undefined) slug = 'hom-nay';
        res.render('pages/index', {
            url: baseurl + 'data/' + slug,
            statuses: createDataStatuses(),
            view: baseurl + 'view/',
        });
    });

    app.use('/', router);
};
