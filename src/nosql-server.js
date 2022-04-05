import TinyDatabase from './database.js'
import {
  storageFolderExists,
  createStorageFolder,
  databaseFolderExists,
  createDatabaseFolder,
  deleteDatabaseFolder,
  listDatabaseFolders,
} from './utils.js'

const DEFAULT_SERVER_NAME = 'TinyNosqlServer'
const DEFAULT_STORAGE_PATH = './.storage'

class TinyNoSqlDbServer {
  name = undefined
  storagePath = undefined
  database = null
  databases = {}

  constructor({ name, path }) {
    this.name = name
    this.storagePath = path

    this.createStorageFolder()
  }

  createStorageFolder() {
    const exists = storageFolderExists(this.storagePath)
    if (exists) return
    createStorageFolder(this.storagePath)
  }

  getStoragePath() {
    return this.storagePath
  }

  getDatabasePath(name) {
    return `${this.storagePath}/${name}`
  }

  createDatabase(name) {
    this.createDatabaseFolder(name)

    const db = new TinyDatabase(name, this.storagePath)
    const databaseProxy = new Proxy(db, {
      get: (target, key) => target[key] ?? target.collection(key),
    })
    this.databases[name] = databaseProxy
    this.database = this.databases[name]
    return this.database
  }

  createDatabaseFolder(name) {
    const databasePath = this.getDatabasePath(name)
    const exists = databaseFolderExists(databasePath)
    if (exists) return
    createDatabaseFolder(databasePath)
  }

  dropDatabase(name) {
    this.deleteDatabaseFolder(name)

    delete this.databases[name]
    return { ok: true, _id: name }
  }

  deleteDatabaseFolder(name) {
    const databasePath = this.getDatabasePath(name)
    const exists = databaseFolderExists(databasePath)
    if (!exists) return
    deleteDatabaseFolder(databasePath)
  }

  listDatabases() {
    const storagePath = this.getStoragePath()
    return listDatabaseFolders(storagePath)
  }

  use(name) {
    const database = this.databases[name]
    if (!database) {
      return this.createDatabase(name)
    }
    return database
  }
}

export default ({
  name = DEFAULT_SERVER_NAME,
  path = DEFAULT_STORAGE_PATH,
} = {}) => {
  return new TinyNoSqlDbServer({ name, path })
}
