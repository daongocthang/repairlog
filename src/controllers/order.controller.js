import db from '../models';
import R from '../R';
import { formatter, isObjectEmpty } from '../R/utils';
import { Sequelize } from 'sequelize';

const Order = db.WorkOrder;

const dateFormatter = [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%d-%m-%Y %H:%i:%S'), 'createdAt'];

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
            res.status(200).send({ message: formatter.str(R.message.remove.ok, count), type: 'success' });
        })
        .catch(() => {
            res.status(500).send({ message: R.message.remove.er, type: 'error' });
        });
};

const create = (req, res) => {
    const newOrder = JSON.parse(req.body.order);

    Order.create(newOrder)
        .then(() => {
            res.status(200).send({ message: formatter.str(R.message.create.ok, 1), type: 'success' });
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
    const order = JSON.parse(req.body.order);
    const { receiptNo } = order;

    delete order.receiptNo;
    if (isObjectEmpty(order)) {
        return res.status(500).send({ message: R.message.nothing, type: 'error' });
    }
    Order.update(order, { where: { receiptNo } })
        .then(() => {
            res.status(200).send({ message: formatter.str(R.message.update.ok, 1), type: 'success' });
        })
        .catch(async (e) => {
            const count = await Order.count({ where: { receiptNo: newOrder.receiptNo } });
            res.status(500);

            let message = R.message.update.er;
            if (count == 0) message = formatter.str(R.message.notfound, 'Mã phiếu');

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
            const message = formatter.str(R.message.status.ok, constraints.receiptNo.length, newStatus);
            res.status(200).send({ message, type: 'success' });
        })
        .catch((e) => {
            res.status(500).send({ message: R.message.status.er, type: 'error' });
        });
};

export default {
    findBySlug,
    removeAllSelections,
    create,
    updateByPk,
    bulkChangeStatus,
};
