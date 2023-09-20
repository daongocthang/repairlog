import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import models from '~/models';
import routes from '~/routes';

global.__basedir = __dirname;
console.log(__dirname);

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public/static'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

models.sequelize.sync();
//     .then(() => console.log('Synced database'))
//     .catch((e) => console.log('Failed to sync database: ' + e.message));

routes(app);

const port = process.env.NODE_DOCKER_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
