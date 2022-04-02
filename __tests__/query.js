import nosqlServer from '../src/nosql-server.js'

describe('document query', () => {
  const server = nosqlServer()
  let db

  beforeEach(() => {
    server.dropDatabase('pruebas')
    db = server.use('pruebas')
  })

  afterAll(() => {
    server.dropDatabase('pruebas')
  })

  test('can find all', () => {
    const inserted = db.people.insertOne({
      id: 1,
      name: 'John',
      surname: 'Dow',
    })

    expect(db.people.find({})).toStrictBe([
      {
        _id: inserted._id,
        id: 1,
        name: 'John',
        surname: 'Dow',
      },
    ])
  })

  test('can filter by prop', () => {
    db.people.insertMany([
      {
        id: 1,
        name: 'John',
        surname: 'Dow',
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

    const peopleJose = db.people.find({ name: 'Jose' })
    expect(peopleJose.length).toBe(2)
  })

  test('can get distinct by prop', () => {
    db.people.insertMany([
      {
        id: 1,
        name: 'John',
        surname: 'Dow',
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
      {
        id: 4,
        name: 'Juan',
        surname: 'Garcia',
      },
    ])

    expect(db.people.count()).toBe(4)

    const differentNames = db.people.distinct('name')
    expect(differentNames.length).toBe(3)
  })
})
