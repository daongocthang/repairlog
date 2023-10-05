import 'dotenv/config';
import { Op } from 'sequelize';
import slugify from 'slugify';

export const dbConfig = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+07:00',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

export const createDataStatuses = () => {
    let data = [{ name: 'đang sửa' }, { name: 'chờ trả' }, { name: 'kết thúc' }];
    return data.map((elem) => {
        elem.slug = slugify(elem.name, { locale: 'vi' });

        return elem;
    });
};

export const createDataStats = () => {
    let data = [
        { name: 'hôm nay', field: '', attr: 'primary' },
        { name: 'chờ trả', field: 'status', attr: 'info' },
        { name: 'đổi máy' },
        { name: 'không hỏng' },
        { name: 'nạp phần mềm' },
        { name: 'hàn lại' },
        { name: 'thay thế' },
        { name: 'chuyển hãng' },
        { name: 'chuyển mức' },
        { name: 'khác' },
        { name: 'đang sửa', field: 'status', attr: 'warning' },
    ];

    return data.map((item) => {
        item['slug'] = slugify(item.name, { locale: 'vi' });
        if (item.field == undefined) {
            item.field = 'method';
            item.attr = 'light';
        }
        return item;
    });
};
