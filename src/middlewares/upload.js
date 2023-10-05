import multer from 'multer';
import fs from 'fs';

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
        cb(null, true);
    } else {
        cb('Please upload only excel file.', file);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = __basedir + '/uploads/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter,
});
