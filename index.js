import express from 'express';
import cors from 'cors';
import models from '~/models';
import routes from '~/routes';

global.__basedir = __dirname;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

models.sequelize.sync();
//     .then(() => console.log('Synced database'))
//     .catch((e) => console.log('Failed to sync database: ' + e.message));

app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express' });
});

routes(app);

const port = process.env.NODE_DOCKER_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
