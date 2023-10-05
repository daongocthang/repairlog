import { dbConfig as cnf } from '../config';
import { Sequelize } from 'sequelize';
import { Order } from './order.model';
import { Method } from './method.model';

const sequelize = new Sequelize(cnf.DB, cnf.USER, cnf.PASSWORD, {
    host: cnf.HOST,
    dialect: cnf.dialect,
    operatorsAliases: false,
    timezone: cnf.timezone,
    pool: cnf.pool,
});

const db = {};
db.sequelize = sequelize;
db.Order = Order(sequelize);
db.Method = Method(sequelize);

export default db;
