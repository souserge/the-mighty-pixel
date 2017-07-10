//const storage = require('azure-storage')
const azure = require('azure')
      confAB = require('./config').azureBlob

class GridStorageManager {
  constructor(errorCallback) {
    this.errorCallback = errorCallback
    this.blobService = azure.createBlobService(confAB.connectionString)
    this.isContainerCreated = false

    this.blobService.createContainerIfNotExists(confAB.blobContainerName,
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

    //TODO: dowload and return Grid object
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
