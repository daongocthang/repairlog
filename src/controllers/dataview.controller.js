import slugify from 'slugify';
import { Op } from 'sequelize';
import Sequelize from 'sequelize';
import db from '../models';

const dateFormatter = [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%d-%m-%Y %H:%i:%S'), 'createdAt'];

const bulkSlugify = (list) => list.map((item) => (item.slug = slugify(item.name, { locale: 'vi' })));

const buildTags = async () => {
    let tags = [
        {
            name: 'hôm nay',
            constraints: { createdAt: { [Op.gte]: new Date().setHours(0, 0, 0, 0) } },
            style: 'primary',
        },
        { name: 'chờ trả', constraints: { status: 'chờ trả' }, style: 'info' },
        { name: 'đang sửa', constraints: { status: 'đang sửa', method: { [Op.is]: null } }, style: 'warning' },
    ];

    const methods = await db.Method.findAll();

    const finalTags = tags.concat(
        methods.map((method) => ({ name: method.name, constraints: { method: method.name }, style: 'light' })),
    );

    return finalTags.map((tag) => {
        tag.slug = slugify(tag.name, { locale: 'vi' });
        return tag;
    });
};

const findBySlug = async (req, res) => {
    const tags = await buildTags();
    const constraints = tags.find((tag) => tag.slug === req.params.slug).constraints;

    console.log(constraints);

    db.WorkOrder.findAll({
        attributes: {
            include: [dateFormatter],
        },
        where: constraints,
    })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(500).send({ message: e.message || 'Some error occured.' });
        });
};
const buildClouds = async (req, res) => {
    let tags = await buildTags();
    tags.forEach((tag) => (tag.count = 0));
    console.log(tags);

    try {
        const countToday = await db.WorkOrder.count({
            where: {
                createdAt: { [Op.gt]: new Date().setHours(0, 0, 0, 0) },
            },
        });

        const queues = await db.WorkOrder.findAll({
            attributes: ['method', 'status'],
            where: {
                [Op.or]: [{ status: { [Op.notLike]: '%kết thúc%' } }],
            },
        });

        tags.forEach((tag) => {
            switch (tag.slug) {
                case 'hom-nay':
                    tag.count = countToday;
                    break;
                case 'cho-tra':
                    tag.count = queues.filter((q) => q.status === tag.name).length;
                    break;
                case 'dang-sua':
                    tag.count = queues.filter((q) => q.status === tag.name && q.method == undefined).length;
                    break;
                default:
                    tag.count = queues.filter(
                        (q) => q.method === tag.name && slugify(q.status, { locale: 'vi' }) !== 'cho-tra',
                    );
            }
        });

        // Return
        res.status(200).send({
            tags,
        });
    } catch (e) {
        res.status(500).send({ message: e.message || 'Some error occured.' });
    }
};

export default {
    findBySlug,
    buildClouds,
};
