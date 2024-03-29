const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Dates extends Model {}

  Dates.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'dates',
    }
  )

  Dates.associate = (models) => {
    Dates.belongsToMany(models.exams, {
      through: models.examDate,
      foreignKey: 'date_id',
    })
  }
  return Dates
}
