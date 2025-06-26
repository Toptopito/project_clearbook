"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.createTable('trend_data', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            test_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            start_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            end_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            count: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            min_value: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            max_value: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            average: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            median: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            standard_deviation: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        });
        // Add indexes
        yield queryInterface.addIndex('trend_data', ['user_id']);
        yield queryInterface.addIndex('trend_data', ['test_name']);
        yield queryInterface.addIndex('trend_data', ['start_date']);
        yield queryInterface.addIndex('trend_data', ['end_date']);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable('trend_data');
    })
};
