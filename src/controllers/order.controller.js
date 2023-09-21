import db from '../models';

const Order = db.WorkOrder;

const removeAllSelections = (req, res) => {
    const selections = JSON.parse(req.body.selections);
    const count = selections.length;
    Order.destroy({
        where: {
            receiptNo: selections,
        },
    })
        .then(() => {
            res.status(200).send({ message: `Đã xóa thành công ${count} giao dịch`, type: 'success' });
        })
        .catch(({ er }) => {
            res.status(500).send({ message: 'Giao dịch không thể xóa', type: 'error' });
        });
};

const createOne = (req, res) => {
    const newOrder = JSON.parse(req.body.stringified);
    Order.create(newOrder)
        .then(() => {
            res.status(200).send({ message: `Đã tạo thành công 1 giao dịch`, type: 'success' });
        })
        .catch(() => {
            res.status(500).send({ message: 'Giao dịch không thể tạo mới', type: 'error' });
        });
};

export default {
    removeAllSelections,
};
