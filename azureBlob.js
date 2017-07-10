//const storage = require('azure-storage')
const azure = require('azure')
      ab = require('./config').azureBlob

class GridStorageManager {
  constructor(errorCallback) {
    this.errorCallback = errorCallback
    this.blobService = azure.createBlobService(ab.connectionString)
    this.isContainerCreated = false

    this.blobService.createContainerIfNotExists(ab.blobContainerName,
      (error, result, response) => {
      if (error) { this.errorCallback(error) }
      else { this.isContainerCreated = true }
    })
  }

  upload(grid) {
    if (!this.isContainerCreated) return

    //TODO: do something with grid
    gridMapJSON = '{}'
    gridMetadataJSON = '{}'

    this.blobService.createBlockBlobFromText(ab.blobContainerName,
      ab.gridMapBlobName, gridMapJSON, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap uploaded */ }
    })

    this.blobService.createBlockBlobFromText(ab.blobContainerName,
      ab.gridMetadataBlobName, gridMetadataJSON, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMetadata uploaded */ }
    })
  }

  download() {
    if (!this.isContainerCreated) return

    //TODO: dowload and return Grid object
  }

  delete() {
    if (!this.isContainerCreated) return

    this.blobService.deleteBlob(ab.blobContainerName,
      ab.gridMapBlobName, (error, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap deleted */ }
    })

    this.blobService.deleteBlob(ab.blobContainerName,
      ab.gridMetadataBlobName, (error, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMetadata deleted */ }
    })
  }
}
