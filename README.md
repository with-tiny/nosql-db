<div align="center">
  <h1>tiny-nosql-db 🤏💾</h1>
  <p>Tiny NoSql Database for little projects</p>
  <hr />
  <p>
    <img src='https://img.shields.io/npm/v/@tiny-apps/nosql-db.svg?style=flat-square' alt='version-badge'>
    <img src='https://img.shields.io/npm/l/@tiny-apps/nosql-db.svg?style=flat-square' alt='license-badge'>
  </p>
</div>

## Installation

Go to the root of your project and run
```
npm install -D @tiny-apps/nosql-db
```

Create the database folder
```
mkdir .storage
```

And it to .gitignore
```
node_modules/
dist/
...
.storage/
```

## Usage

Import the server and start it.
```js
import nosqlServer from '@tiny-apps/nosql-server'

const server = nosqlServer()
```

Then set the database to use
```js
const db = server.use('test_database')
```

And just choose a collection and run any method on it
```js
db.test_people.insertOne({
  name: 'John',
  surname: 'Dow',
  age: 31,
})
```
Here is the complete example

```js
import nosqlServer from '@tiny-apps/nosql-server'

const server = nosqlServer()
const db = server.use('test_database')

db.test_people.insertOne({
  name: 'John',
  surname: 'Dow',
  age: 31,
})
// returns { ok: true, _id: xxx, count: 1 }

db.test_people.find({
  age: 31,
})
// returns [{ _id: xxx, name: 'John', surname: 'Dow', age: 31 }]
```

## Available methods

### Server
- use(_dbName). Sets the current database to _dbName
- listDatabases(). Return an array of all databases of the server
- createDatabase(_name). Creates a database (implicit in use())
- dropDatabase(_name). Deletes a database

### Database
- collection(_name) o db[_name]. Sets the current collection to _name
- listCollections(). Return an array of all collections of the database
- createCollection(_name). Creates a collection (implicit in db.[_name])
- dropCollection(_name). Deletes a collection

### Collection
- find(_filter). Query the collection and returns matched records
- findOne(_filter). Returns a record if only one matches
- count(_filter). Count the records mathed on a query
- distinct(_field). Return distinct values of _field in a collection
- insertOne(_record). Insert a record
- insertMany(_recordList). Insert a list of records
- updateOne(_filter, _record). Update a record if only one matches
- updateMany(_filter, _record). Update records that matches
- deleteOne(_filter). Delete a record if only one matches
- deleteMany(_filter). Delete records that matches

## Next Features

- Query filter specials ({ $gt: 5, $in: [1, 3, 5, 7, 9], etc... })
