const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

class Template extends Model { }
Template.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true
    }
}, { sequelize, modelName: 'Templates' });



class TemplateLocale extends Model { }
TemplateLocale.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    locale: {
        type: DataTypes.CHAR(5),
        allowNull: false
    },
    contents: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'TemplatesLocales',
    indexes: [{ unique: true, fields: ['templateId', "locale"] }]
});

// Template.hasMany(TemplateLocale);

TemplateLocale.belongsTo(Template, {
    foreignKey: "templateId",
    as: "template"
});



exports.Template = Template;
exports.TemplateLocale = TemplateLocale;