import readXlsxFile from 'read-excel-file/node';
import fs from 'fs';
import db from '../models';

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
        rows.forEach((row) => {
            let newWorkOrder = {
                receiptNo: row[0],
                model: row[1],
                serial: row[2],
                description: row[3],
            };

            workorders.push(newWorkOrder);
        });

        try {
            await WorkOrder.bulkCreate(workorders, {
                ignoreDuplicates: true,
            });

            res.status(200).send({
                message: 'Uploaded the file successfully: ' + req.file.originalname,
            });
        } catch (e) {
            res.status(500).send({
                message: 'Fail to import to database.',
                error: e.message,
            });
        }

        fs.unlinkSync(req.file.path);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Could not upload the file: ' + req.file.originalname });
    }
};
