import slugify from 'slugify';
import { Op } from 'sequelize';
import db from '../models';
import R from '../R';

const clouds = async (req, res) => {
    let tags = structuredClone(R.tags);
    tags.forEach((tag) => (tag.count = 0));
    try {
        const countToday = await db.Order.count({
            where: {
                createdAt: { [Op.gt]: new Date().setHours(0, 0, 0, 0) },
            },
        });

        const queues = await db.Order.findAll({
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
                    ).length;
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

export default clouds;
