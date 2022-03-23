import TinyNoSqlDbServer from '../src/TinyNoSqlDbServer.js'

await test('can delete one record', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

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

  db.people.remove()
})

await test('can delete many records', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

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

  db.people.remove()
})
