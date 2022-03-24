import TinyCollection from './TinyCollection.js'
import {
  collectionFileExists,
  createCollectionFile,
  deleteCollectionFile,
  listCollectionFiles,
} from './utils.js'

export default class TinyDatabase {
  name = null
  collections = {}

  constructor(name) {
    this.name = name
  }

  createCollection(name) {
    this.createCollectionFile(name)

    this.collections[name] = new TinyCollection(name, this.name)
    return { ok: true, _id: name }
  }

  createCollectionFile(name) {
    const exists = collectionFileExists(this.name, name)
    if (exists) return
    createCollectionFile(this.name, name)
  }

  dropCollection(name) {
    this.deleteCollectionFile(name)

    delete this.collections[name]
    return { ok: true, _id: name }
  }

  deleteCollectionFile(name) {
    const exists = collectionFileExists(this.name, name)
    if (!exists) return
    deleteCollectionFile(this.name, name)
  }

  listCollections() {
    return listCollectionFiles(this.name)
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
