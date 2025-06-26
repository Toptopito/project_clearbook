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
        yield queryInterface.createTable('documents', {
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
            lab_result_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                unique: true, // Enforce one-to-one relationship
                references: {
                    model: 'lab_results',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            file_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            file_path: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            file_type: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            file_size: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            upload_date: {
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
        yield queryInterface.addIndex('documents', ['user_id']);
        yield queryInterface.addIndex('documents', ['lab_result_id'], { unique: true });
        // Update lab_results table to add the document_id foreign key
        yield queryInterface.addConstraint('lab_results', {
            fields: ['document_id'],
            type: 'foreign key',
            name: 'lab_results_document_id_fkey',
            references: {
                table: 'documents',
                field: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        // Remove the constraint first
        yield queryInterface.removeConstraint('lab_results', 'lab_results_document_id_fkey');
        // Then drop the table
        yield queryInterface.dropTable('documents');
    })
};
