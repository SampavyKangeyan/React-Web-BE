const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
    "User",
    {
        id: {
          type:  DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement:true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reset_token: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: "users",
        timestamps: false,
    }
);

module.exports = User;