import { dbConfig as cnf } from '../config';
import { Sequelize } from 'sequelize';
import { WorkOrder } from './workorder.model';

const sequelize = new Sequelize(cnf.DB, cnf.USER, cnf.PASSWORD, {
    host: cnf.HOST,
    dialect: cnf.dialect,
    operatorsAliases: false,
    pool: cnf.pool,
});

const db = {};
db.sequelize = sequelize;
db.WorkOrder = WorkOrder(sequelize);

export default db;
