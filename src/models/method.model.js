import { DataTypes } from 'sequelize';

export const Method = (sequelize) =>
    sequelize.define(
        'Method',
        {
            name: DataTypes.STRING,
        },
        { timestamps: false },
    );
