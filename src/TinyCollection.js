import { nanoid } from 'nanoid'

export default class TinyCollection {
  name = null
  records = {}

  constructor(name) {
    this.name = name
  }

  insertOne(newRecord) {
    const _id = nanoid()
    this.records[_id] = {
      _id,
      ...newRecord,
    }
    return { ok: true, _id, count: 1 }
  }

  insertMany(newRecords) {
    const _ids = newRecords.map((newRecord) => {
      let { _id } = this.insertOne(newRecord)
      return _id
    })

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
    return { ok: true, _id, count: 1 }
  }

  updateMany(filter = {}, updateRecord) {
    const records = this.find(filter)
    if (!records.length) return { ok: true, count: 0 }

    let updatedRecords = { ...this.records }

    const _ids = records.map((record) => {
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

    return { ok: true, _ids, count: _ids.length }
  }

  deleteOne(filter = {}) {
    const { _id } = this.findOne(filter)
    if (!_id) return { ok: true, count: 0 }

    delete this.records[_id]
    return { ok: true, _id, count: 1 }
  }

  deleteMany(filter = {}) {
    const records = this.find(filter)
    if (!records.length) return { ok: true, count: 0 }

    const _ids = records.map((record) => {
      delete this.records[record._id]
      return record._id
    })

    return { ok: true, _ids, count: _ids.length }
  }

  find(filter = {}) {
    let tmpRegistry = Object.values(this.records)
    Object.entries(filter).forEach(
      ([field, value]) =>
        (tmpRegistry = tmpRegistry.filter((record) => record[field] === value))
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
      ...new Set(Object.values(this.records).map((record) => record[field])),
    ]
  }

  remove() {
    this.records = {}
  }
}
