import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import models from '~/models';
import routes from '~/routes';
import { TagBuilder } from './R/utils';
import { Op } from 'sequelize';
import R from './R';

global.__basedir = __dirname + '/public';

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public/static'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

models.sequelize.sync().then(async () => {
    let methods = await models.Method.findAll();
    R.tags.push(
        ...methods.map((m) => {
            return TagBuilder.build(m.name, { method: m.name, status: { [Op.notLike]: '%chờ trả%' } });
        }),
    );
});
//     .catch((e) => console.log('Failed to sync database: ' + e.message));

routes(app);

const port = process.env.NODE_DOCKER_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
