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
        yield queryInterface.createTable('users', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            first_name: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            date_of_birth: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true,
            },
            gender: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true,
            },
            phone: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: true,
            },
            last_login: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            password_reset_token: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            password_reset_expires: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            onboarding_completed: {
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
        yield queryInterface.addIndex('users', ['email'], { unique: true });
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable('users');
    })
};
