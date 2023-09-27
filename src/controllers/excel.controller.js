import fs from 'fs';
import readXlsxFile from 'read-excel-file/node';
import R from '../R';
import db from '../models';
import { Workbook } from 'exceljs';
import { str } from '../R/utils';
import moment from 'moment/moment';

const Order = db.WorkOrder;

export const upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({ message: str.format(R.message.notfound, 'File'), type: 'error' });
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
    const constriants = { receiptNo: rows.map((row) => str.sanify(row[0])).filter((s) => !isEmpty(s)) };

    let results = await Order.findAll({
        attributes: ['receiptNo'],
        where: constriants,
        raw: true,
    });

    const duplicates = results.map((row) => row.receiptNo);

    rows.forEach((row) => {
        let newOrder = {
            receiptNo: str.sanify(row[0]),
            model: str.sanify(row[1]),
            serial: str.sanify(row[2]),
            description: str.sanify(row[3]),
        };

        // Optional: classisy the orders

        const pk = newOrder.receiptNo;
        if (str.empty(pk)) {
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
        .then(async () => {
            // TODO: export file of invalid rows
            console.log(invalidOrders);
            let type = pendingOrders.length == rows.length ? 'success' : 'error';

            const wb = new Workbook();
            const ws = wb.addWorksheet('Error');
            ws.columns = new ColsBuilder()
                .append('Mã phiếu', 'receiptNo', 32)
                .append('Tên TB', 'model', 15)
                .append('Serial', 'serial', 15)
                .append('Mô tả lỗi', 'description', 32)
                .append('Error', 'error', 32)
                .build();
            ws.addRows(invalidOrders);
            const fname = 'Error__' + moment().format('YYMMDDHHmmss');
            await sendXlsxFile(fname, wb, res);

            res.status(200).send({
                // message: 'Uploaded the file successfully: ' + req.file.originalname,
                message: str.format(R.message.create.ok, pendingOrders.length + '/' + rows.length),
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

const sendXlsxFile = async (name, wb, res) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', str.format('attachment; filename={0}.xlsx', name));

    await wb.xlsx.write(res);
};

class ColsBuilder {
    #cols = [];
    append(header, key, width = 15) {
        this.#cols.push({ header, key, width });
        return this;
    }
    build() {
        return this.#cols;
    }
}
