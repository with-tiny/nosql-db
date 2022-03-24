import TinyDatabase from './TinyDatabase.js'
import {
  databaseFolderExists,
  createDatabaseFolder,
  deleteDatabaseFolder,
  listDatabaseFolders,
} from './utils.js'

export default class TinyNoSqlDbServer {
  database = null
  databases = {}

  createDatabase(name) {
    this.createDatabaseFolder(name)

    const databaseProxy = new Proxy(new TinyDatabase(name), {
      get: (target, key) => target[key] ?? target.collection(key),
    })
    this.databases[name] = databaseProxy
    this.database = this.databases[name]
    return this.database
  }

  createDatabaseFolder(name) {
    const exists = databaseFolderExists(name)
    if (exists) return
    createDatabaseFolder(name)
  }

  dropDatabase(name) {
    this.deleteDatabaseFolder(name)

    delete this.databases[name]
    return { ok: true, _id: name }
  }

  deleteDatabaseFolder(name) {
    const exists = databaseFolderExists(name)
    if (!exists) return
    deleteDatabaseFolder(name)
  }

  listDatabases() {
    return listDatabaseFolders()
  }

  use(name) {
    const database = this.databases[name]
    if (!database) {
      return this.createDatabase(name)
    }
    return database
  }
}
