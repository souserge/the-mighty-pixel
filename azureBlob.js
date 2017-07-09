//const storage = require('azure-storage')
const azure = require('azure')

const config = {
  connectionString: 'local',
  blobContainerName: 'grid-container',
  gridMapBlobName: 'grid-map',
  gridMetadataBlobName: 'grid-metadata'
}

class GridStorageManager {
  constructor(errorCallback) {
    this.errorCallback = errorCallback
    this.blobService = azure.createBlobService(config.connectionString)
    this.isContainerCreated = false

    this.blobService.createContainerIfNotExists(config.blobContainerName,
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

    this.blobService.createBlockBlobFromText(config.blobContainerName,
      config.gridMapBlobName, gridMapJSON, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap uploaded */ }
    })

    this.blobService.createBlockBlobFromText(config.blobContainerName,
      config.gridMetadataBlobName, gridMetadataJSON, (error, result, response) => {
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

    this.blobService.deleteBlob(config.blobContainerName,
      config.gridMapBlobName, (error, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap deleted */ }
    })

    this.blobService.deleteBlob(config.blobContainerName,
      config.gridMetadataBlobName, (error, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMetadata deleted */ }
    })
  }
}
