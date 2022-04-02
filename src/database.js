import TinyCollection from './collection.js'
import {
  collectionFileExists,
  createCollectionFile,
  deleteCollectionFile,
  listCollectionFiles,
} from './utils.js'

export default class TinyDatabase {
  name = null
  collections = {}
  storagePath = undefined

  constructor(name, storagePath) {
    this.name = name
    this.storagePath = storagePath
  }

  getDatabasePath() {
    return `${this.storagePath}/${this.name}`
  }

  getCollectionPath(name) {
    return `${this.storagePath}/${this.name}/${name}.json`
  }

  createCollection(name) {
    this.createCollectionFile(name)

    this.collections[name] = new TinyCollection(
      name,
      this.name,
      this.storagePath,
    )
    return { ok: true, _id: name }
  }

  createCollectionFile(name) {
    const collectionPath = this.getCollectionPath(name)
    const exists = collectionFileExists(collectionPath)
    if (exists) return
    createCollectionFile(collectionPath)
  }

  dropCollection(name) {
    this.deleteCollectionFile(name)

    delete this.collections[name]
    return { ok: true, _id: name }
  }

  deleteCollectionFile(name) {
    const collectionPath = this.getCollectionPath(name)
    const exists = collectionFileExists(collectionPath)
    if (!exists) return
    deleteCollectionFile(collectionPath)
  }

  listCollections() {
    const databasePath = this.getDatabasePath()
    return listCollectionFiles(databasePath)
  }

  collection(name) {
    const collection = this.collections[name]
    if (!collection) {
      this.createCollection(name)
      return this.collections[name]
    }
    return collection
  }
}
