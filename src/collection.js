import { nanoid } from 'nanoid'
import { loadCollectionFromFile, dumpCollectionToFile } from './utils.js'

export default class TinyCollection {
  name = null
  database = null
  records = {}
  storagePath = undefined

  constructor(name, database, storagePath) {
    this.name = name
    this.database = database
    this.storagePath = storagePath

    this.loadFromFile()
  }

  getCollectionPath() {
    return `${this.storagePath}/${this.database}/${this.name}.json`
  }

  loadFromFile() {
    const collectionPath = this.getCollectionPath()
    this.records = loadCollectionFromFile(collectionPath)
  }

  dumpToFile() {
    const collectionPath = this.getCollectionPath()
    dumpCollectionToFile(collectionPath, this.records)
  }

  insertOne(newRecord, multi = false) {
    const _id = nanoid()
    this.records[_id] = {
      _id,
      ...newRecord,
    }

    if (!multi) this.dumpToFile()
    return { ok: true, _id, count: 1 }
  }

  insertMany(newRecords) {
    const _ids = newRecords.map(newRecord => {
      let { _id } = this.insertOne(newRecord, true)
      return _id
    })

    this.dumpToFile()
    return { ok: true, _ids, count: _ids.length }
  }

  updateOne(filter = {}, updateRecord) {
    const { _id, ...rest } = this.findOne(filter)
    if (!_id) return { ok: true, count: 0 }

    this.records = {
      ...this.records,
      [_id]: {
        _id,
        ...rest,
        ...updateRecord,
      },
    }

    this.dumpToFile()
    return { ok: true, _id, count: 1 }
  }

  updateMany(filter = {}, updateRecord) {
    const records = this.find(filter)
    if (!records.length) return { ok: true, count: 0 }

    let updatedRecords = { ...this.records }

    const _ids = records.map(record => {
      updatedRecords = {
        ...updatedRecords,
        [record._id]: {
          ...record,
          ...updateRecord,
        },
      }
      return record._id
    })
    this.records = updatedRecords

    this.dumpToFile()
    return { ok: true, _ids, count: _ids.length }
  }

  deleteOne(filter = {}) {
    const { _id } = this.findOne(filter)
    if (!_id) return { ok: true, count: 0 }

    delete this.records[_id]

    this.dumpToFile()
    return { ok: true, _id, count: 1 }
  }

  deleteMany(filter = {}) {
    const records = this.find(filter)
    if (!records.length) return { ok: true, count: 0 }

    const _ids = records.map(record => {
      delete this.records[record._id]
      return record._id
    })

    this.dumpToFile()
    return { ok: true, _ids, count: _ids.length }
  }

  find(filter = {}) {
    let tmpRegistry = Object.values(this.records)
    Object.entries(filter).forEach(
      ([field, value]) =>
        (tmpRegistry = tmpRegistry.filter(record => record[field] === value)),
    )
    return tmpRegistry
  }

  findOne(filter = {}) {
    const records = this.find(filter)
    if (records.length > 1) {
      throw new Error('findOne returned more than one record')
    }
    return records[0]
  }

  count(filter = {}) {
    return this.find(filter).length
  }

  distinct(field) {
    return [
      ...new Set(Object.values(this.records).map(record => record[field])),
    ]
  }

  remove() {
    this.records = {}
    this.dumpToFile()
  }
}
