import readXlsxFile from 'read-excel-file/node';
import fs from 'fs';
import db from '../models';
import { log } from 'console';

const WorkOrder = db.WorkOrder;

export const upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({ message: 'Please upload an excel file.' });
        }

        const path = __basedir + '/res/uploads/' + req.file.filename;

        let workorders = [];
        let rows = await readXlsxFile(path);
        rows.shift();

        if (req.params.field == undefined) {
            rows.forEach((row) => {
                let newWorkOrder = {
                    receiptNo: row[0],
                    model: row[1],
                    serial: row[2],
                    description: row[3],
                };

                workorders.push(newWorkOrder);
            });

            WorkOrder.bulkCreate(workorders, {
                ignoreDuplicates: true,
            })
                .then(
                    res.status(200).send({
                        message: 'Uploaded the file successfully: ' + req.file.originalname,
                    }),
                )
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || 'Fail to import to database.',
                    });
                });
        } else {
            let field = req.params.field;
            let value = {};
            let promises = [];

            rows.forEach((row) => {
                value[field] = row[1];
                promises.push(WorkOrder.update(value, { where: { receiptNo: row[0] } }));
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
        }

        fs.unlinkSync(req.file.path);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Could not upload the file: ' + req.file.originalname });
    }
};
