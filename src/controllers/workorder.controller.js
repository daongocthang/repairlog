import moment from 'moment/moment';
import { Op } from 'sequelize';
import Sequelize from 'sequelize';
import { createDataStats, createDataStatuses } from '../config';
import db from '../models';

const COMPLETABLE = 'chờ trả';
const WorkOrder = db.WorkOrder;
const dateFormat = [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%d-%m-%Y %H:%i:%S'), 'createdAt'];

export const findAll = (req, res) => {
    WorkOrder.findAll({
        attributes: {
            include: [dateFormat],
        },
    })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(500).send({ message: e.message || 'Some error occured.' });
        });
};

export const findFromToday = (req, res) => {
    WorkOrder.findAll({
        attributes: {
            include: [dateFormat],
        },
        where: {
            createdAt: {
                [Op.gt]: new Date().setHours(0, 0, 0, 0),
            },
        },
    })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(500).send({ message: e.message || 'Some error occured.' });
        });
};

export const findForThreeMonths = (req, res) => {
    WorkOrder.findAll({
        attributes: {
            include: [dateFormat],
        },
        where: {
            createdAt: {
                [Op.gte]: moment().subtract(3, 'months').toDate(),
            },
        },
    })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(500).send({ message: e.message || 'Some error occured.' });
        });
};

export const findBySlug = async (req, res) => {
    let data = createDataStats().find((elem) => elem.slug == req.params.slug);
    if (!data) return res.send([]);

    let constraints = {};
    constraints[data.field] = data.name;
    if (data.slug === 'dang-sua') constraints.method = { [Op.is]: null };
    else if (data.field == 'method') constraints.status = { [Op.eq]: 'đang sửa' };

    WorkOrder.findAll({
        attributes: {
            include: [dateFormat],
        },
        where: constraints,
    })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(500).send({ message: e.message || 'Some error occured.' });
        });
};

export const bulkChangeStatus = (req, res) => {
    let { slug } = req.params;
    const data = JSON.parse(req.body.serializable);
    const status = createDataStatuses().find((s) => s.slug === slug).name;
    console.log(status);
    WorkOrder.update(
        {
            status,
        },
        {
            where: { receiptNo: data },
        },
    )
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(500).send({ message: e.message || 'Some error occured.' });
        });
    // res.send({ slug, data });
};

export const fetchDataStats = async (req, res) => {
    let data = createDataStats().map((item) => {
        item.count = 0;
        return item;
    });

    try {
        const countOfToday = await WorkOrder.count({
            where: {
                createdAt: { [Op.gt]: new Date().setHours(0, 0, 0, 0) },
            },
        });

        const queues = await WorkOrder.findAll({
            attributes: ['method', 'status'],
            where: {
                [Op.or]: [{ status: { [Op.notLike]: '%kết thúc%' } }],
            },
        });

        data.forEach((obj) => {
            switch (obj.field) {
                case 'method':
                    obj.count = queues.filter((q) => q.method === obj.name && q.status != COMPLETABLE).length;
                    break;
                case 'status':
                    if (obj.name === COMPLETABLE) obj.count = queues.filter((q) => q.status === obj.name).length;
                    else obj.count = queues.filter((q) => q.method == undefined && q.status === obj.name).length;
                    break;
                default:
                    obj.count = countOfToday;
            }
        });

        // Return
        res.status(200).send({
            data,
        });
    } catch (e) {
        res.status(500).send({ message: e.message || 'Some error occured.' });
    }
};
