import nosqlServer from '../src/nosql-server.js'

describe('comparation operators', () => {
  const server = nosqlServer()
  let db

  beforeEach(() => {
    server.dropDatabase('pruebas')
    db = server.use('pruebas')
  })

  afterAll(() => {
    server.dropDatabase('pruebas')
  })

  test('can filter by _gt', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const olderThan30 = db.people.find({ age: { _gt: 30 } })
    expect(olderThan30).toHaveLength(1)
  })

  test('can filter by _gte', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const olderThan30 = db.people.find({ age: { _gte: 30 } })
    expect(olderThan30).toHaveLength(2)
  })

  test('can filter by _lt', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const youngerThan30 = db.people.find({ age: { _lt: 30 } })
    expect(youngerThan30).toHaveLength(1)
  })

  test('can filter by _lte', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const youngerThan30 = db.people.find({ age: { _lte: 30 } })
    expect(youngerThan30).toHaveLength(2)
  })

  test('can filter by _gte and _lte', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const youngerThan30 = db.people.find({ age: { _gte: 30, _lte: 30 } })
    expect(youngerThan30).toHaveLength(1)
  })

  test('can filter by two keys', () => {
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

    const qry = db.people.find({ age: { _gt: 20 }, beersConsumed: { _gt: 20 } })
    expect(qry).toHaveLength(1)
  })

  test('can filter by _eq', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const thirties = db.people.find({ age: { _eq: 30 } })
    expect(thirties).toHaveLength(1)
  })

  test('can filter by _neq', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const notThirties = db.people.find({ age: { _neq: 30 } })
    expect(notThirties).toHaveLength(2)
  })

  test('can filter by _in', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const falsyNames = db.people.find({ name: { _in: ['Fornido', 'Gancho'] } })
    expect(falsyNames).toHaveLength(2)
  })

  test('can filter by _nin', () => {
    db.people.insertMany([
      {
        name: 'Fornido',
        surname: 'Rock',
        age: 31,
      },
      {
        name: 'Max',
        surname: 'Power',
        age: 19,
      },
      {
        name: 'Gancho',
        surname: 'Lance',
        age: 30,
      },
    ])

    const truthyNames = db.people.find({
      name: { _nin: ['Fornido', 'Gancho'] },
    })
    expect(truthyNames).toHaveLength(1)
  })
})
