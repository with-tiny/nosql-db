import fs from 'fs'

export const storageFolderExists = storage => {
  return fs.existsSync(storage)
}

export const createStorageFolder = storage => {
  return fs.mkdirSync(storage)
}

export const databaseFolderExists = databasePath => {
  return fs.existsSync(databasePath)
}

export const createDatabaseFolder = databasePath => {
  return fs.mkdirSync(databasePath)
}

export const deleteDatabaseFolder = databasePath => {
  return fs.rmSync(databasePath, { recursive: true, force: true })
}

export const listDatabaseFolders = storage =>
  fs
    .readdirSync(storage, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name)

export const collectionFileExists = collectionPath => {
  return fs.existsSync(collectionPath)
}

export const createCollectionFile = collectionPath => {
  return fs.closeSync(fs.openSync(collectionPath, 'w'))
}

export const deleteCollectionFile = collectionPath => {
  return fs.rmSync(collectionPath, { force: true })
}
export const listCollectionFiles = databasePath =>
  fs
    .readdirSync(databasePath, { withFileTypes: true })
    .filter(item => !item.isDirectory() && item.name.endsWith('.json'))
    .map(item => item.name.slice(0, -('json'.length + 1)))

export const loadCollectionFromFile = collectionPath => {
  let content = fs.readFileSync(collectionPath, 'utf8') || '{}'
  return JSON.parse(content ?? '{}')
}

export const dumpCollectionToFile = (collectionPath, content) =>
  fs.writeFile(collectionPath, JSON.stringify(content, null, 2), () => {})
