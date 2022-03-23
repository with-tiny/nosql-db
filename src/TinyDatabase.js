import TinyCollection from './TinyCollection.js'

export default class TinyDatabase {
  name = null
  collections = {}

  constructor(name) {
    this.name = name
  }

  createCollection(name) {
    this.collections[name] = new TinyCollection(name)
    return { ok: true, _id: name }
  }

  dropCollection(name) {
    delete this.collections[name]
    return { ok: true, _id: name }
  }

  listCollections() {
    return Object.keys(this.collections)
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
