import fs from 'fs';
import readXlsxFile from 'read-excel-file/node';
import R from '../R';
import { formatter } from '../R/utils';
import { isEmpty, sanifyInput } from '../R/utils';
import db from '../models';

const Order = db.WorkOrder;

export const upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({ message: 'Please upload an excel file.', type: 'error' });
        }

        const path = __basedir + '/uploads/' + req.file.filename;

        let rows = await readXlsxFile(path);
        // console.log(rows);
        // res.send({ message: formatter.str(R.message.create.ok, rows.length) });

        rows.shift();

        if (req.params.type === 'create') {
            await bulkCreate(rows, res);
        }
        //  else if (req.params.type === 'update') {
        //     await bulkUpdate(rows, req, res);
        // } else {
        //     throw new Error('Not found any request');
        // }
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Could not upload the file: ' + req.file.originalname });
    } finally {
        if (req.file) fs.unlinkSync(req.file.path);
    }
};

const bulkCreate = async (rows, res) => {
    let pendingOrders = [];
    let invalidOrders = [];
    const constriants = { receiptNo: rows.map((row) => sanifyInput(row[0])).filter((s) => !isEmpty(s)) };

    let results = await Order.findAll({
        attributes: ['receiptNo'],
        where: constriants,
        raw: true,
    });

    const duplicates = results.map((row) => row.receiptNo);

    rows.forEach((row) => {
        let newOrder = {
            receiptNo: sanifyInput(row[0]),
            model: sanifyInput(row[1]),
            serial: sanifyInput(row[2]),
            description: sanifyInput(row[3]),
        };

        // Optional: classisy the orders

        const pk = newOrder.receiptNo;
        if (isEmpty(pk)) {
            newOrder.error = R.message.invalid;
            invalidOrders.push(newOrder);
        } else if (duplicates.includes(pk)) {
            newOrder.error = R.message.exists;
            invalidOrders.push(newOrder);
        } else {
            pendingOrders.push(newOrder);
        }
    });

    Order.bulkCreate(pendingOrders, {
        ignoreDuplicates: true,
    })
        .then(() => {
            // TODO: export file of invalid rows
            console.log(invalidOrders);
            let type = pendingOrders.length == rows.length ? 'success' : 'error';
            res.status(200).send({
                // message: 'Uploaded the file successfully: ' + req.file.originalname,
                message: formatter.str(R.message.create.ok, pendingOrders.length + '/' + rows.length),
                type,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Fail to import to database.',
            });
        });
};

const bulkUpdate = (rows, res) => {
    let field = req.params.field;
    let value = {};
    let promises = [];

    rows.forEach((row) => {
        value[field] = row[1];
        promises.push(Order.update(value, { where: { receiptNo: row[0] } }));
    });
    Promise.all(promises)
        .then(() => {
            res.status(200).send({
                message: 'Uploaded the file successfully: ' + req.file.originalname,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Fail to import to database.',
            });
        });
};
