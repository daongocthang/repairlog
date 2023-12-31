import moment from 'moment/moment';
import sanitize from 'sanitize-html';
import { Op, Sequelize } from 'sequelize';
import R from '../R';
import { obj, str } from '../R/utils';
import db from '../models';

const Order = db.Order;

const dateFormatter = [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%d-%m-%Y %H:%i:%S'), 'createdAt'];

const findByQuery = (req, res) => {
    const { start, end, key, value } = req.query;
    let constraints = {};
    const startDate = moment(start, 'DD-MM-YYYY');
    const endDate = moment(end, 'DD-MM-YYYY').endOf('day');
    const valueSearch = str.empty(value) ? null : str.sanitize(value);

    constraints.createdAt = { [Op.between]: [startDate, endDate] };
    if (key !== 'all') {
        if (key === 'serial') {
            Object.assign(constraints, {
                [Op.or]: [{ serial: { [Op.substring]: valueSearch } }, { newSerial: { [Op.substring]: valueSearch } }],
            });
        } else constraints[key] = { [Op.substring]: valueSearch };
    }

    Order.findAll({
        attributes: {
            include: [dateFormatter],
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

const findBySlug = async (req, res) => {
    const constraints = R.tags.find((tag) => tag.slug === req.params.slug).constraints;

    Order.findAll({
        attributes: {
            include: [dateFormatter],
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

const removeAllSelections = (req, res) => {
    const selections = JSON.parse(req.body.selections);
    const count = selections.length;

    Order.destroy({
        where: {
            receiptNo: selections,
        },
    })
        .then(() => {
            res.status(200).send({ message: str.format(R.message.remove.ok, count), type: 'success' });
        })
        .catch(() => {
            res.status(500).send({ message: R.message.remove.er, type: 'error' });
        });
};

const create = async (req, res) => {
    const newOrder = JSON.parse(str.sanitize(req.body.order));
    obj.sanitize(newOrder);

    if (!str.empty(newOrder.serial)) {
        const serialsFromLast35days = await filterAvailableSerials([newOrder.serial], 35);
        if (serialsFromLast35days.length > 0) {
            newOrder.warning = 'QL30';
            newOrder.method = 'khác';
        }
    }

    Order.create(newOrder)
        .then(() => {
            res.status(200).send({ message: str.format(R.message.create.ok, 1), type: 'success' });
        })
        .catch(async (e) => {
            const count = await Order.count({ where: { receiptNo: newOrder.receiptNo } });
            res.status(500);

            let message = R.message.create.er;
            if (count > 0) message = R.message.exists;

            res.send({ message, type: 'error' });
        });
};

const updateByPk = (req, res) => {
    const order = JSON.parse(sanitize(req.body.order));
    const { receiptNo } = order;

    delete order.receiptNo;
    obj.sanitize(order);

    if (obj.empty(order)) {
        return res.status(500).send({ message: R.message.nothing, type: 'error' });
    }
    Order.update(order, { where: { receiptNo } })
        .then(() => {
            res.status(200).send({ message: str.format(R.message.update.ok, 1), type: 'success' });
        })
        .catch(async (e) => {
            const count = await Order.count({ where: { receiptNo: newOrder.receiptNo } });
            res.status(500);

            let message = R.message.update.er;
            if (count == 0) message = str.format(R.message.notfound, 'Mã phiếu');

            res.send({ message, type: 'error' });
        });
};

const bulkChangeStatus = (req, res) => {
    const constraints = {
        receiptNo: JSON.parse(req.body.constraints),
    };
    const newStatus = R.status.find((s) => s.slug === req.params.status).name;

    Order.update(
        {
            status: newStatus,
        },
        {
            where: constraints,
        },
    )
        .then(() => {
            const message = str.format(R.message.status.ok, constraints.receiptNo.length, newStatus);
            res.status(200).send({ message, type: 'success' });
        })
        .catch((e) => {
            res.status(500).send({ message: R.message.status.er, type: 'error' });
        });
};

export const filterAvailableSerials = async (serials, interval) => {
    const results = await Order.findAll({
        attributes: ['serial', 'newSerial'],
        where: {
            createdAt: { [Op.gte]: moment().subtract(interval, 'days').toDate() },
            [Op.or]: [{ serial: serials }, { newSerial: serials }],
        },
        raw: true,
    });

    const arr1 = results.map((row) => row.serial);
    const arr2 = results.map((row) => row.newSerial);

    return arr1.concat(arr2);
};

export default {
    findByQuery,
    findBySlug,
    removeAllSelections,
    create,
    updateByPk,
    bulkChangeStatus,
};
