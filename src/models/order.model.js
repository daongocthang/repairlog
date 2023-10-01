import { DataTypes } from 'sequelize';

export const Order = (sequelize) =>
    sequelize.define(
        'Order',
        {
            receiptNo: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            model: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            serial: DataTypes.STRING,
            description: DataTypes.TEXT,
            newSerial: DataTypes.STRING,
            remark: DataTypes.TEXT,
            warning: DataTypes.STRING,
            method: DataTypes.STRING,
            status: { type: DataTypes.STRING, defaultValue: 'đang sửa' },
        },
        { updatedAt: false },
    );
