import fs from 'fs';
import readXlsxFile from 'read-excel-file/node';
import R from '../R';
import { obj, str } from '../R/utils';
import db from '../models';
import { filterAvailableSerials } from './order.controller';

const Order = db.Order;
const Method = db.Method;

export const upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({ message: str.format(R.message.notfound, 'File'), type: 'error' });
        }

        const path = __basedir + '/uploads/' + req.file.filename;

        let rows = await readXlsxFile(path);

        rows.shift();

        if (req.params.type === 'create') {
            await bulkCreate(rows, res);
        } else if (req.params.type === 'update') {
            await bulkUpdate(rows, req, res);
        }
    } catch (e) {
        res.status(500).send({ message: 'Could not upload the file: ' + req.file.originalname });
    } finally {
        if (req.file) fs.unlinkSync(req.file.path);
    }
};

const bulkCreate = async (rows, res) => {
    let pendingOrders = [];
    const constriants = { receiptNo: rows.map((row) => str.sanitize(row[0])).filter((s) => !str.empty(s)) };

    const ws = new Worksheet('ImportError');
    ws.addColumn({ header: 'Mã phiếu', key: 'receiptNo', width: 32 })
        .addColumn({ header: 'Tên TB', key: 'model', width: 32 })
        .addColumn({ header: 'Serial', key: 'serial', width: 18 })
        .addColumn({ header: 'Mô tả lỗi', key: 'description', width: 32 })
        .addColumn({ header: 'Thông báo lỗi', key: 'error', width: 20 });

    let results = await Order.findAll({
        attributes: ['receiptNo', 'serial'],
        where: constriants,
        raw: true,
    });

    const duplicates = results.map((row) => row.receiptNo);

    const serials = rows.map((row) => str.sanitize(row[2])).filter((s) => !str.empty(s) || !duplicates.includes(s));

    const availableSerialsFromLast35days = await filterAvailableSerials(serials, 35);

    rows.forEach((row) => {
        let newOrder = {
            receiptNo: str.sanitize(row[0]),
            model: str.sanitize(row[1]),
            serial: str.sanitize(row[2]),
            description: str.sanitize(row[3]),
        };
        obj.sanitize(newOrder);

        if (availableSerialsFromLast35days.includes(newOrder.serial)) {
            newOrder.warning = 'QL30';
            newOrder.method = 'khác';
        }

        // Optional: classisy the orders

        const pk = newOrder.receiptNo;
        if (str.empty(pk)) {
            newOrder.error = str.format(R.message.invalid, 'Mã phiếu');
            ws.addRow(newOrder);
        } else if (duplicates.includes(pk)) {
            newOrder.error = R.message.exists;
            ws.addRow(newOrder);
        } else {
            pendingOrders.push(newOrder);
        }
    });

    Order.bulkCreate(pendingOrders, {
        ignoreDuplicates: true,
    })
        .then(() => {
            let type = ws.empty() ? 'success' : 'error';
            let datasheet = ws.empty() ? undefined : ws.json();

            res.status(200).send({
                datasheet,
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

const bulkUpdate = async (rows, req, res) => {
    const ignoreBlank = req.body.ignoreBlank === 'true';
    const constriants = { receiptNo: rows.map((row) => str.sanitize(row[0])).filter((s) => !str.empty(s)) };
    let promises = [];
    let results;

    const ws = new Worksheet('ImportError');
    ws.addColumn({ header: 'Mã phiếu', key: 'receiptNo', width: 32 })
        .addColumn({ header: 'Serial Mới', key: 'model', width: 18 })
        .addColumn({ header: 'Biện pháp', key: 'serial', width: 18 })
        .addColumn({ header: 'Chi tiết SC', key: 'description', width: 18 })
        .addColumn({ header: 'Thông báo lỗi', key: 'error', width: 18 });

    results = await Method.findAll({ raw: true });

    const methods = results.map((row) => row.name);

    results = await Order.findAll({
        attributes: ['receiptNo'],
        where: constriants,
        raw: true,
    });

    const availbilities = results.map((row) => row.receiptNo);

    rows.forEach((row) => {
        let newOrder = { receiptNo: str.sanitize(row[0]) };

        // TODO: ignore_blank
        let s = undefined;
        if (ignoreBlank) {
            s = str.sanitize(row[1]);
            if (!str.empty(s)) newOrder.newSerial = s;
            s = str.sanitize(row[2]);
            if (!str.empty(s)) newOrder.method = s;
            s = str.sanitize(row[3]);
            if (!str.empty(s)) newOrder.remark = s;
        } else {
            newOrder.newSerial = str.sanitize(row[1]);
            newOrder.method = str.sanitize(row[2]);
            newOrder.remark = str.sanitize(row[3]);
            obj.sanitize(newOrder);
        }

        const method = newOrder.method;
        const pk = newOrder.receiptNo;

        if (!availbilities.includes(pk)) {
            newOrder.error = str.format(R.message.notfound, 'Mã phiếu');
            ws.addRow(newOrder);
        } else if (!str.empty(method) && !methods.includes(method.toLowerCase())) {
            newOrder.error = str.format(R.message.invalid, 'Biện pháp SC');
            ws.addRow(newOrder);
        } else {
            promises.push(Order.update(newOrder, { where: { receiptNo: row[0] } }));
        }
    });

    const count = promises.length;
    Promise.all(promises)
        .then(() => {
            let type = ws.empty() ? 'success' : 'error';
            let datasheet = ws.empty() ? undefined : ws.json();
            res.status(200).send({
                datasheet,
                message: str.format(R.message.update.ok, count + '/' + rows.length),
                type,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Fail to import to database.',
            });
        });
};

class Worksheet {
    #rows = [];
    #cols = [];
    #sheetName;

    constructor(sheetName = 'Sheet1') {
        this.#sheetName = sheetName;
    }

    addColumn(col = { header, width }) {
        this.#cols.push(col);
        return this;
    }

    addColumns(cols) {
        this.#cols.push(...cols);
    }

    addRow(row) {
        this.#rows.push(row);
        return this;
    }

    addRows(rows) {
        this.#rows.push(...rows);
    }

    empty() {
        return this.#rows.length == 0;
    }

    json() {
        const wcols = this.#cols.map((c) => ({ wch: c.width }));
        const data = this.#rows.map((row) => {
            let newRow = {};
            this.#cols.forEach((col) => {
                const value = row[col.key];
                newRow[col.header] = value ? value : '';
            });

            return newRow;
        });

        return { data, sheetName: this.#sheetName, widthCols: wcols };
    }
}
