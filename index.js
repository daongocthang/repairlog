import express from 'express';
import cors from 'cors';
import models from '~/models';
import routes from '~/routes';

global.__basedir = __dirname;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './public/templates');

app.use(express.static(__dirname + '/public/static'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

models.sequelize.sync();
//     .then(() => console.log('Synced database'))
//     .catch((e) => console.log('Failed to sync database: ' + e.message));

app.get('/', async (req, res) => {
    let data = await models.WorkOrder.findAll();
    res.render('pages/index', { data });
});

routes(app);

const port = process.env.NODE_DOCKER_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
