import { DataTypes } from 'sequelize';

export const WorkOrder = (sequelize) =>
    sequelize.define(
        'WorkOrder',
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
            remarks: DataTypes.TEXT,
            method: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
        },
        { updatedAt: false },
    );
