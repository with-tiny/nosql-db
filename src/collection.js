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

  query(record, filter, parentField) {
    return Object.entries(filter).reduce((flag, [field, value]) => {
      if (field === '_eq') return flag && record[parentField] === value
      if (field === '_neq') return flag && record[parentField] !== value
      if (field === '_gt') return flag && record[parentField] > value
      if (field === '_gte') return flag && record[parentField] >= value
      if (field === '_lt') return flag && record[parentField] < value
      if (field === '_lte') return flag && record[parentField] <= value
      if (field === '_in') return flag && value.includes(record[parentField])
      if (field === '_nin') return flag && !value.includes(record[parentField])
      if (field === '_and')
        return flag && value.every(cond => this.query(record, cond))
      if (field === '_or')
        return flag && value.some(cond => this.query(record, cond))
      if (field === '_nor')
        return flag && !value.some(cond => this.query(record, cond))
      if (field === '_not') return flag && !this.query(record, value)
      if (typeof value === 'object')
        return flag && this.query(record, value, field)
      return record[field] === value
    }, true)
  }

  find(filter = {}) {
    let tmpRegistry = Object.values(this.records)

    return tmpRegistry.filter(record => this.query(record, filter))
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
