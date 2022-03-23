import TinyNoSqlDbServer from '../src/TinyNoSqlDbServer.js'

await test('can update one record', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

  db.people.insertOne({
    id: 1,
    name: 'John',
    surname: 'Dow',
  })

  db.people.updateOne({ id: 1 }, { name: 'Paco' })

  expect(db.people.count()).toBe(1)
  expect(db.people.findOne({ id: 1 }).name).toBe('Paco')

  db.people.remove()
})

await test('can update many records', () => {
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

  const updated = db.people.updateMany({ name: 'Jose' }, { name: 'Paco' })

  expect(updated.count).toBe(2)
  expect(db.people.count()).toBe(2)
  expect(db.people.count({ name: 'Paco' })).toBe(2)

  db.people.remove()
})
