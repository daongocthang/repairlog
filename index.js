import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressEjsLayouts from 'express-ejs-layouts';
import models from '~/models';
import { useBrowserRoutes, useApiRoutes } from '~/routes';

global.__basedir = __dirname;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './public/templates');

app.use(express.static(__dirname + '/public/static'));

app.use(expressEjsLayouts);
app.set('layout', './layouts/default');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

models.sequelize.sync();
//     .then(() => console.log('Synced database'))
//     .catch((e) => console.log('Failed to sync database: ' + e.message));

useBrowserRoutes(app);
useApiRoutes(app);

const port = process.env.NODE_DOCKER_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
