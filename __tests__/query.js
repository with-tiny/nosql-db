import TinyNoSqlDbServer from '../src/TinyNoSqlDbServer.js'

await test('can find all', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

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

  db.people.remove()
})

await test('can filter by prop', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

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

  db.people.remove()
})

await test('can get distinct by prop', () => {
  const server = new TinyNoSqlDbServer()
  const db = server.use('pruebas')

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

  db.people.remove()
})
