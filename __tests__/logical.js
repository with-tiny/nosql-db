import nosqlServer from '../src/nosql-server.js'

describe('logical operators', () => {
  const server = nosqlServer()
  let db

  beforeEach(() => {
    server.dropDatabase('pruebas')
    db = server.use('pruebas')
  })

  afterAll(() => {
    server.dropDatabase('pruebas')
  })

  test('can filter by _and', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
        beersConsumed: 17,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
        beersConsumed: 0,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
        beersConsumed: 49,
      },
    ])

    const query = db.people.findOne({
      _and: [{ age: 30 }, { beersConsumed: { _gt: 10 } }],
    })
    expect(query.name).toBe('Gancho')
  })

  test('can filter by _or', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
        beersConsumed: 17,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
        beersConsumed: 0,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
        beersConsumed: 49,
      },
    ])

    const query = db.people.find({
      _or: [{ age: 30 }, { beersConsumed: { _gt: 10 } }],
    })
    expect(query).toHaveLength(2)
  })

  test('can filter by _nor', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
        beersConsumed: 17,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
        beersConsumed: 0,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
        beersConsumed: 49,
      },
    ])

    const query = db.people.findOne({
      _nor: [{ age: 30 }, { beersConsumed: { _gt: 10 } }],
    })
    expect(query.name).toBe('Max')
  })

  test('can filter by _not', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
        beersConsumed: 17,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
        beersConsumed: 0,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
        beersConsumed: 49,
      },
    ])

    const query = db.people.find({ _not: { age: 30 } })
    expect(query).toHaveLength(2)
  })
})
