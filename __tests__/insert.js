import TinyNoSqlDbServer from '../src/TinyNoSqlDbServer.js'

await test('can insert one record', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

  const inserted = db.people.insertOne({
    id: 1,
    name: 'John',
    surname: 'Dow',
  })

  expect(inserted.ok).toBe(true)
  expect(db.people.count()).toBe(1)

  db.people.remove()
})

await test('can insert many records', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

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

  db.people.remove()
})
