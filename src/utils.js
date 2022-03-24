import fs from 'fs'

const STORAGE_PATH = './_storage'
const COLLECTION_EXTENSION = 'json'

const getDatabaseFolderPath = (database) => `${STORAGE_PATH}/${database}`
const getCollectionFilePath = (database, collection) =>
  `${STORAGE_PATH}/${database}/${collection}.${COLLECTION_EXTENSION}`

export const databaseFolderExists = (database) => {
  const databaseFolder = getDatabaseFolderPath(database)
  return fs.existsSync(databaseFolder)
}

export const createDatabaseFolder = (database) => {
  const databaseFolder = getDatabaseFolderPath(database)
  return fs.mkdirSync(databaseFolder)
}

export const deleteDatabaseFolder = (database) => {
  const databaseFolder = getDatabaseFolderPath(database)
  return fs.rmSync(databaseFolder, { recursive: true, force: true })
}

export const listDatabaseFolders = () =>
  fs
    .readdirSync(STORAGE_PATH, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)

export const collectionFileExists = (database, collection) => {
  const collectionFile = getCollectionFilePath(database, collection)
  return fs.existsSync(collectionFile)
}

export const createCollectionFile = (database, collection) => {
  const collectionFile = getCollectionFilePath(database, collection)
  return fs.closeSync(fs.openSync(collectionFile, 'w'))
}

export const deleteCollectionFile = (database, collection) => {
  const collectionFile = getCollectionFilePath(database, collection)
  return fs.rmSync(collectionFile, { force: true })
}
export const listCollectionFiles = (database) => {
  const databaseFolder = getDatabaseFolderPath(database)
  return fs
    .readdirSync(databaseFolder, { withFileTypes: true })
    .filter(
      (item) =>
        !item.isDirectory() && item.name.endsWith(`.${COLLECTION_EXTENSION}`)
    )
    .map((item) => item.name.slice(0, -(COLLECTION_EXTENSION.length + 1)))
}

export const loadCollectionFromFile = (database, collection) => {
  const collectionFile = getCollectionFilePath(database, collection)
  let content = fs.readFileSync(collectionFile, 'utf8') || '{}'
  return JSON.parse(content ?? '{}')
}

export const dumpCollectionToFile = (database, collection, content) => {
  const collectionFile = getCollectionFilePath(database, collection)

  return fs.writeFile(
    collectionFile,
    JSON.stringify(content, null, 2),
    () => {}
  )
}
