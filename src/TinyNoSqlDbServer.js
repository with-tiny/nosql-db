import TinyDatabase from './TinyDatabase.js'

export default class TinyNoSqlDbServer {
  database = null
  databases = {}

  createDatabase(name) {
    const databaseProxy = new Proxy(new TinyDatabase(name), {
      get: (target, key) => target[key] ?? target.collection(key),
    })
    this.databases[name] = databaseProxy
    this.database = this.databases[name]
    return this.database
  }

  dropDatabase(name) {
    delete this.databases[name]
    return { ok: true, _id: name }
  }

  listDatabases() {
    return Object.keys(this.databases)
  }

  use(name) {
    const database = this.databases[name]
    if (!database) {
      return this.createDatabase(name)
    }
    return database
  }
}
