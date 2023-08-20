import db from '../models';

const WorkOrder = db.WorkOrder;

export const findAll = (req, res) => {
    WorkOrder.findAll()
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(500).send({ message: e.message || 'Some error occured.' });
        });
};
