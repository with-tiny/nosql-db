import nosqlServer from '../src/nosql-server.js'

describe('document insertion', () => {
  const server = nosqlServer()
  let db

  beforeEach(() => {
    server.dropDatabase('pruebas')
    db = server.use('pruebas')
  })

  afterAll(() => {
    server.dropDatabase('pruebas')
  })

  test('can insert one record', () => {
    const inserted = db.people.insertOne({
      id: 1,
      name: 'John',
      surname: 'Dow',
    })

    expect(inserted.ok).toBe(true)
    expect(db.people.count()).toBe(1)
  })

  test('can insert many records', () => {
    const inserted = db.people.insertMany([
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

    expect(inserted.ok).toBe(true)
    expect(inserted._ids.length).toBe(2)
    expect(db.people.count()).toBe(2)
  })
})
