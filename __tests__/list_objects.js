import TinyNoSqlDbServer from '../src/TinyNoSqlDbServer.js'

await test('can list databases', () => {
  const server = new TinyNoSqlDbServer()

  expect(server.listDatabases()).toStrictBe([])

  server.use('pruebas')

  expect(server.listDatabases()).toStrictBe(['pruebas'])
})

await test('can list collections', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

  expect(db.listCollections()).toStrictBe([])

  db.people.insertOne({
    id: 1,
    name: 'John',
    surname: 'Dow',
  })

  expect(db.listCollections()).toStrictBe(['people'])

  db.people.remove()
})
