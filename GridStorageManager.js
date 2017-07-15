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

  upload(grid) {
    if (!this.isContainerCreated) return

    //TODO: do something with grid
    let gridMapJSON = '{}'
    let gridMetadataJSON = '{}'

    this.blobService.createBlockBlobFromText(confAB.blobContainerName,
      confAB.gridMapBlobName, gridMapJSON, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap uploaded */ }
    })

    this.blobService.createBlockBlobFromText(confAB.blobContainerName,
      confAB.gridMetadataBlobName, gridMetadataJSON, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMetadata uploaded */ }
    })
  }

  download() {
    if (!this.isContainerCreated) return


    this.blobService.getBlobToText(confAB.blobContainerName,
      confAB.gridMapBlobName, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else {
        //TODO: figure out how to get JSON
        console.log(result)
      }
    })

    this.blobService.getBlobToText(confAB.blobContainerName,
      confAB.gridMetadataBlobName, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else {
        //TODO: figure out how to get JSON
        console.log(result)
      }
    })

    let grid = new Map()
    let config = {}
    //TODO: construct a Grid object from JSON strings
    return [grid, config]
  }

  delete() {
    if (!this.isContainerCreated) return

    this.blobService.deleteBlob(confAB.blobContainerName,
      confAB.gridMapBlobName, (error, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap deleted */ }
    })

    this.blobService.deleteBlob(confAB.blobContainerName,
      confAB.gridMetadataBlobName, (error, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMetadata deleted */ }
    })
  }
}



module.exports = GridStorageManager
