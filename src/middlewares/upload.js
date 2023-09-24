import multer from 'multer';

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
        cb(null, true);
    } else {
        cb('Please upload only excel file.', file);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/');
    },
    filename: (req, file, cb) => {
        // console.log(file.path);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter,
});
