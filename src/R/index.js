import { Op } from 'sequelize';
import { TagBuilder } from './utils';
import slugify from 'slugify';

const message = {
    create: {
        ok: `Đã tạo thành công {0} giao dịch`,
        er: 'Giao dịch không thể tạo mới',
    },
    remove: { ok: `Đã xóa thành công {0} giao dịch`, er: 'Giao dịch không thể xóa' },
    update: {
        ok: `Đã cập nhật thành công {0} giao dịch`,
        er: `Giao dịch không thể cập nhật`,
    },
    status: {
        ok: `{0} giao dịch chuyển sang "{1}"`,
        er: `Giao dịch không thể chuyển trạng thái`,
    },
    exists: 'Mã phiếu đang tồn tại',
    notfound: '{0} không tồn tại',
    nothing: 'Không có dữ liệu mới',
    invalid: '{0} không hợp lệ',
};

const status = ['đang sửa', 'chờ trả', 'kết thúc'].map((s) => {
    let slug = slugify(s, { locale: 'vi' });
    return { name: s, slug };
});

const tags = [
    TagBuilder.build('hôm nay', { createdAt: { [Op.gte]: new Date().setHours(0, 0, 0, 0) } }, 'primary'),
    TagBuilder.build('chờ trả', { status: 'chờ trả' }, 'info'),
    TagBuilder.build('đang sửa', { status: 'đang sửa', method: { [Op.is]: null } }, 'warning'),
];

export default {
    status,
    tags,
    message,
};
