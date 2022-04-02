import nosqlServer from '../src/nosql-server.js'

describe('document deletion', () => {
  const server = nosqlServer()
  let db

  beforeEach(() => {
    server.dropDatabase('pruebas')
    db = server.use('pruebas')
  })

  afterAll(() => {
    server.dropDatabase('pruebas')
  })

  test('can delete one record', () => {
    db.people.insertMany([
      {
        id: 2,
        name: 'Jose',
        surname: 'Martinez',
      },
      {
        id: 3,
        name: 'Jose',
        surname: 'Fernandez',
      },
    ])

    expect(db.people.count()).toBe(2)

    db.people.deleteOne({ id: 2 })
    expect(db.people.count()).toBe(1)
  })

  test('can delete many records', () => {
    db.people.insertMany([
      {
        id: 1,
        name: 'Juan',
        surname: 'Salazar',
      },
      {
        id: 2,
        name: 'Jose',
        surname: 'Martinez',
      },
      {
        id: 3,
        name: 'Jose',
        surname: 'Fernandez',
      },
    ])

    expect(db.people.count()).toBe(3)

    db.people.deleteMany({ name: 'Jose' })
    expect(db.people.count()).toBe(1)
  })
})
