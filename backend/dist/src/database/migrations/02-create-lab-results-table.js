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
        yield queryInterface.createTable('lab_results', {
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
            document_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true, // Optional document
                references: {
                    model: 'documents',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            test_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            test_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            result_value: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            unit: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            reference_range_low: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            reference_range_high: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            lab_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            ordering_doctor: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            is_abnormal: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
        yield queryInterface.addIndex('lab_results', ['user_id']);
        yield queryInterface.addIndex('lab_results', ['test_name']);
        yield queryInterface.addIndex('lab_results', ['test_date']);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable('lab_results');
    })
};
