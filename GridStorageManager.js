const azure = require('azure-storage'),
//const azure = require('azure'),
confAB = require('./config').azureBlob

class GridStorageManager {
  constructor(errorCallback, createdCallback) {
    this.errorCallback = errorCallback
    this.createdCallback = createdCallback
    this.blobService = azure.createBlobService(confAB.connectionString)
    this.isContainerCreated = false
    this.isNew = true

    this.blobService.createContainerIfNotExists(confAB.blobContainerName,
      (error, result, response) => {
      if (error) { this.errorCallback(error) }
      else {
        this.isContainerCreated = true
        this.isNew = result.created
        this.createdCallback(result)
      }
    })
  }

  upload(gridMap, gridMetadata) {
    if (!this.isContainerCreated) return

    const mapToJSON = (map) => { return JSON.stringify([...map]) }

    let gridMapJSON = mapToJSON(gridMap)
    let gridMetadataJSON = JSON.stringify(gridMetadata)

    return new Promise((resolve, reject) => {
      let resolveCount = 0

      const onLoad = () => {
        resolveCount++
        if (resolveCount > 1) {
          resolve()
        }
      }

      this.blobService.createBlockBlobFromText(confAB.blobContainerName,
        confAB.gridMapBlobName, gridMapJSON, (error, result, response) => {
          if(error) {
            this.errorCallback(error)
            reject(error)
          }
          else {
            onUpload()
          }
      })

      this.blobService.createBlockBlobFromText(confAB.blobContainerName,
        confAB.gridMetadataBlobName, gridMetadataJSON, (error, result, response) => {
          if(error) {
            this.errorCallback(error)
            reject(error)
          }
          else {
            onUpload()
          }
      })
    })
  }

  download() {
    if (!this.isContainerCreated) return

    const JSONToMap = (str) => { return new Map(JSON.parse(str)) }

    return new Promise((resolve, reject) => {
      let resolveCount = 0
      let grid = new Map()
      let config = {}

      const onDownoad = () => {
        resolveCount++
        console.log('resolveCount: ' + resolveCount + '; config: ')
        console.log(config)
        if (resolveCount > 1) {
          resolve([grid, config])
        }
      }

      this.blobService.getBlobToText(confAB.blobContainerName,
        confAB.gridMapBlobName, (error, result, response) => {
        if(error) {
          this.errorCallback(error)
          reject(error)
        }
        else {
          grid = JSONToMap(result)
          onDownoad()
        }
      })

      this.blobService.getBlobToText(confAB.blobContainerName,
        confAB.gridMetadataBlobName, (error, result, response) => {
        if(error) {
          this.errorCallback(error)
          reject(error)
        }
        else {
          config = JSON.parse(result)
          onDownoad()
        }
      })
    })
  }

  delete() {
    if (!this.isContainerCreated) return

    this.blobService.deleteContainerIfExists(confAB.blobContainerName,
      (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap deleted */ }
    })
  }
}


module.exports = GridStorageManager
