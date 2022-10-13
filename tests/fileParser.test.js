const FileParser = require('../filesDriver/fileParser.js')

describe('FileParser.parseCsv', () => {
  test('Should return parsed data when default exam', () => {
    const rus = `01 - Русский язык 2022.06.23;;;;;;;;;;;;;;;;;;;;;;;;;;;
      №;;Код МСУ;;Код ОО;;Класс;;Код ППЭ;;Аудитория;;Фамилия;Имя;Отчество;;Серия;;Номер;;Задания с кратким ответом;;Задания с развёрнутым ответом;;Первичный балл;;Балл;
      1;;111;;111002;;11;;1018;;9;;Иванов;Иван;Иванович;;1111;;222222;;++++++;;1(1)1(1)1(1)1(1);;6;;39;
      Средние;;;;;;;;;;;;;;;;;;;;;;;;;6;;39
      Минимальная граница;;;;;;;;;;;;;;;;;;;;;;;24;;;;
      Всего участников;;;;;;;;;;;;;;;;;;;;;;;1;;;;
    `
    const result = {
      title: {
        code: '01',
        examName: 'русский язык',
        date: '23.06.2022',
      },
      body: [
        {
          local_government_code: '111',
          organization_code: '111002',
          class: '11',
          code_exam_point: '1018',
          auditorium_number: '9',
          last_name: 'Иванов',
          first_name: 'Иван',
          patronymic: 'Иванович',
          short_answer: '++++++',
          detailed_answer: '1(1)1(1)1(1)1(1)',
          prymary_score: '6',
          estimation: '39',
        },
      ],
    }

    const fileParser = new FileParser(rus)
    expect(fileParser.parseCsv()).toEqual(result)
  })

  test('Should return parsed data when english exam', () => {
    const eng = `"Английский язык п:2022.06.14; у:2022.06.16";;;;;;;;;;;;;;;;;;;;;
    №;Фамилия;;;Имя;;;Отчество;;Документ;Код ОО;Класс;Код ППЭ;Аудитория;;Часть с кратким ответом;Часть с развёрнутым ответом;Устная часть;Первичный балл устной части;Первичный балл письм. части;Первичный балл;Тестовый балл
    1;Иванов;;;Иван;;;Иванович;;1111 222222;111001;11Б;п:1111 у:1081;п:0003 у:0002;;+++73---;2(2)2(2);0(1)0(4)0(5);11;45;56;56
    2;Петров;;;Петр;;;Петрович;;3333 444444;111002;11;п:1111 у:1081;п:0003 у:0002;;46--72+++;1(2)1(2);0(1)4(4)5(5);1;38;39;39
    3;Смирнов;;;Семен;;;Викторович диме;;5555 666666;111002;11;п:1111 у:1081;п:0003 у:0002;;46--++96;1(2)1(2);0(1)4(4)5(5);1;38;39;39
    `
    const result = {
      title: {
        code: 'п:09; у:29',
        examName: 'английский язык',
        date: 'п:14.06.2022; у:16.06.2022',
      },
      body: [
        {
          last_name: 'Иванов',
          first_name: 'Иван',
          patronymic: 'Иванович',
          organization_code: '111001',
          class: '11Б',
          code_exam_point: 'п:1111 у:1081',
          auditorium_number: 'п:0003 у:0002',
          short_answer: '+++73---',
          detailed_answer: '2(2)2(2)',
          oral_answer: '0(1)0(4)0(5)',
          oral_score: '11',
          written_score: '45',
          prymary_score: '56',
          estimation: '56',
        },
        {
          last_name: 'Петров',
          first_name: 'Петр',
          patronymic: 'Петрович',
          organization_code: '111002',
          class: '11',
          code_exam_point: 'п:1111 у:1081',
          auditorium_number: 'п:0003 у:0002',
          short_answer: '46--72+++',
          detailed_answer: '1(2)1(2)',
          oral_answer: '0(1)4(4)5(5)',
          oral_score: '1',
          written_score: '38',
          prymary_score: '39',
          estimation: '39',
        },
        {
          last_name: 'Смирнов',
          first_name: 'Семен',
          patronymic: 'Викторович диме',
          organization_code: '111002',
          class: '11',
          code_exam_point: 'п:1111 у:1081',
          auditorium_number: 'п:0003 у:0002',
          short_answer: '46--++96',
          detailed_answer: '1(2)1(2)',
          oral_answer: '0(1)4(4)5(5)',
          oral_score: '1',
          written_score: '38',
          prymary_score: '39',
          estimation: '39',
        },
      ],
    }

    const fileParser = new FileParser(eng)
    expect(fileParser.parseCsv()).toEqual(result)
  })

  test('Should return parsed data when basic math exam', () => {
    const basicMath = `22 - Математика базовая 2022.06.27;;;;;;;;;;;;
    №;Код ОО;Класс;Код ППЭ;Аудитория;Фамилия;Имя;Отчество;Серия;Номер;Задания с кратким ответом;Первичный балл;Оценка
    1;111001;11Б;1081;0005;Иванов;Иван;Иванович;1111;222222;++++-+++-+++-+--++---;13;4
    2;111001;11А;1081;0004;Петров;Петр;Петрович;3333;444444;++++-+-----+---------;6;2
    3;111002;11;1081;0001;Смирнов;Семен;Викторович диме;5555;666666;+++++++++++--+--+----;13;4
    Средние;;;;;;;;;;;9;3
    Всего участников;;;;;;;;;;;11;
    `
    const result = {
      title: {
        code: '22',
        examName: 'математика базовая',
        date: '27.06.2022',
      },
      body: [
        {
          organization_code: '111001',
          class: '11Б',
          code_exam_point: '1081',
          auditorium_number: '0005',
          last_name: 'Иванов',
          first_name: 'Иван',
          patronymic: 'Иванович',
          short_answer: '++++-+++-+++-+--++---',
          prymary_score: '13',
          estimation: '4',
        },
        {
          organization_code: '111001',
          class: '11А',
          code_exam_point: '1081',
          auditorium_number: '0004',
          last_name: 'Петров',
          first_name: 'Петр',
          patronymic: 'Петрович',
          short_answer: '++++-+-----+---------',
          prymary_score: '6',
          estimation: '2',
        },
        {
          organization_code: '111002',
          class: '11',
          code_exam_point: '1081',
          auditorium_number: '0001',
          last_name: 'Смирнов',
          first_name: 'Семен',
          patronymic: 'Викторович диме',
          short_answer: '+++++++++++--+--+----',
          prymary_score: '13',
          estimation: '4',
        },
      ],
    }

    const fileParser = new FileParser(basicMath)
    expect(fileParser.parseCsv()).toEqual(result)
  })
})
