const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Exams extends Model {}

  Exams.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'exams',
    }
  )

  Exams.associate = (models) => {
    Exams.belongsToMany(models.dates, {
      through: models.examDate,
      foreignKey: 'exam_id',
    })

    Exams.hasMany(models.examDate, {
      foreignKey: 'exam_id',
    })
  }

  return Exams
}
