const readCsvFiles = require('../filesDriver')
const { db, DBService } = require('../databaseDriver')

const {
  exams,
  dates,
  examDate,
  schools,
  classes,
  schoolClass,
  students,
  results,
} = db

module.exports = class GIA11Service {
  static #configForSelectExamDate = {
    attributes: [],
    include: [
      {
        model: dates,
      },
      {
        model: exams,
      },
      {
        model: students,
        through: {
          attributes: { exclude: ['student_id', 'exam_date_id'] },
        },
        attributes: { exclude: ['school_class_id'] },
        include: {
          model: schoolClass,
          attributes: { exclude: ['school_id', 'class_id'] },
          include: [classes, schools],
        },
      },
    ],
  }

  static async selectExamsWithDates() {
    try {
      return await exams.findAll({
        attributes: ['code', 'name'],
        include: [
          {
            model: dates,
            through: {
              attributes: [],
            },
            attributes: ['date'],
          },
        ],
      })
    } catch (error) {
      return error
    }
  }

  static async insert(path) {
    try {
      const csvData = await readCsvFiles(path)
      const appealsData = csvData.filter((data) => data.isRecheking)
      const resultsData = csvData.filter((data) => !data.isRecheking)
      const insertedResults = await db.sequelize.transaction(async (t) => {
        const insertedResults = []
        for (const resultsChunk of resultsData) {
          const insertedResult = await DBService.insertResults(
            {
              exams,
              dates,
              examDate,
              schools,
              classes,
              schoolClass,
              students,
              results,
            },
            resultsChunk,
            {
              transaction: t,
            }
          )
          insertedResults.push(insertedResult)
        }
        return insertedResults
      })
      const insertedAppeals = await db.sequelize.transaction(async (t) => {
        const insertedAppeals = []
        for (const appealsChunk of appealsData) {
          const insertedAppeal = await DBService.insertAppeals(
            {
              exams,
              dates,
              examDate,
              students,
              results,
            },
            appealsChunk,
            {
              transaction: t,
            }
          )
          insertedAppeals.push(insertedAppeal)
        }
        return insertedAppeals
      })

      return [...insertedResults, ...insertedAppeals]
    } catch (error) {
      return error
    }
  }

  static async selectByDate({ date }) {
    try {
      const where = {}
      if (date) where['$date.date$'] = date

      return await DBService.findAll(examDate, {
        where,
        ...this.#configForSelectExamDate,
      })
    } catch (error) {
      return error
    }
  }

  static async selectByExam({ name, code }) {
    try {
      const where = {}
      if (name) where['$exam.name$'] = name
      if (code) where['$exam.code$'] = code

      return await DBService.findAll(examDate, {
        where,
        ...this.#configForSelectExamDate,
      })
    } catch (error) {
      return error
    }
  }

  static async selectBySchool({ code, name }) {
    try {
      const where = {}
      if (code) where['$school.code$'] = code
      if (name) where['$school.short_name$'] = name

      return await DBService.findAll(schoolClass, {
        where,
        attributes: [],
        include: [
          {
            model: schools,
          },
          {
            model: classes,
          },
          {
            model: students,
            attributes: { exclude: ['school_class_id'] },
            include: [
              {
                model: examDate,
                through: {
                  attributes: { exclude: ['student_id', 'exam_date_id'] },
                },
                attributes: { exclude: ['date_id', 'exam_id'] },
                include: [dates, exams],
              },
            ],
          },
        ],
      })
    } catch (error) {
      return error
    }
  }

  static async selectByStudent({ lastname, firstname, patronymic }) {
    try {
      const where = {}
      if (lastname) where['last_name'] = lastname
      if (firstname) where['first_name'] = firstname
      if (patronymic) where['patronymic'] = patronymic

      return await DBService.findAll(students, {
        where,
        attributes: { exclude: ['school_class_id'] },
        include: [
          {
            model: schoolClass,
            attributes: { exclude: ['school_id', 'class_id'] },
            include: [schools, classes],
          },
          {
            model: examDate,
            through: {
              attributes: { exclude: ['exam_date_id', 'student_id'] },
            },
            attributes: { exclude: ['exam_id', 'date_id'] },
            include: [dates, exams],
          },
        ],
      })
    } catch (error) {
      return error
    }
  }

  static async selectSchools() {
    try {
      return await schools.findAll({
        attributes: ['code', 'short_name'],
      })
    } catch (error) {
      return error
    }
  }

  static async updateSchool({ id, code, short_name, full_name }) {
    return await schools.update(
      {
        code,
        short_name,
        full_name,
      },
      {
        where: {
          id,
        },
      }
    )
  }

  static async updateExam({ id, code, name }) {
    return await exams.update(
      {
        code,
        name,
      },
      {
        where: {
          id,
        },
      }
    )
  }

  static async updateDate({ id, date }) {
    return await dates.update(
      {
        date,
      },
      {
        where: {
          id,
        },
      }
    )
  }

  static async updateStudent({ id, last_name, first_name, patronymic }) {
    return await students.update(
      {
        last_name,
        first_name,
        patronymic,
      },
      {
        where: {
          id,
        },
      }
    )
  }
}
