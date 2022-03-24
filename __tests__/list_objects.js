import TinyNoSqlDbServer from '../src/TinyNoSqlDbServer.js'

describe('object listing', () => {
  const server = new TinyNoSqlDbServer()
  let db

  beforeEach(() => {
    server.dropDatabase('pruebas')
  })

  afterAll(() => {
    server.dropDatabase('pruebas')
  })

  test('can list databases', () => {
    expect(server.listDatabases()).toStrictBe([])

    server.use('pruebas')

    expect(server.listDatabases()).toStrictBe(['pruebas'])
  })

  test('can list collections', () => {
    db = server.use('pruebas')

    expect(db.listCollections()).toStrictBe([])

    db.people.insertOne({
      id: 1,
      name: 'John',
      surname: 'Dow',
    })

    expect(db.listCollections()).toStrictBe(['people'])
  })
})
