const { Sequelize, Model, DataTypes, Deferrable } = require('sequelize');

const sequelize = require('../utils/database');
const { TemplateLocale } = require('./templateModel');

class Mail extends Model { }
Mail.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    recepientUserId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    recepientEmail: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    recepientName: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    contents: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sent: {
        type: DataTypes.DATE,
        allowNull: true
    },
    error: DataTypes.TEXT
}, { sequelize, modelName: 'Mails' });


Mail.belongsTo(TemplateLocale, {
    foreignKey: "templateId",
    as: "template"
});

module.exports = Mail;