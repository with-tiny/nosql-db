import TinyNoSqlDbServer from '../src/TinyNoSqlDbServer.js'

describe('document update', () => {
  const server = new TinyNoSqlDbServer()
  let db

  beforeEach(() => {
    server.dropDatabase('pruebas')
    db = server.use('pruebas')
  })

  afterAll(() => {
    server.dropDatabase('pruebas')
  })

  test('can update one record', () => {
    db.people.insertOne({
      id: 1,
      name: 'John',
      surname: 'Dow',
    })

    db.people.updateOne({ id: 1 }, { name: 'Paco' })

    expect(db.people.count()).toBe(1)
    expect(db.people.findOne({ id: 1 }).name).toBe('Paco')
  })

  test('can update many records', () => {
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

    const updated = db.people.updateMany({ name: 'Jose' }, { name: 'Paco' })

    expect(updated.count).toBe(2)
    expect(db.people.count()).toBe(2)
    expect(db.people.count({ name: 'Paco' })).toBe(2)
  })
})
