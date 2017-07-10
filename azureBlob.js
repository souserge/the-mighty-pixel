//const storage = require('azure-storage')
const azure = require('azure')

const config = {
  connectionString: 'local',
  blobContainerName: 'gridcontainer'
}


const blobService = azure.createBlobService(config.connectionString)

blobService.createContainerIfNotExists(config.blobContainerName,
  (error, result, response) => {
  if (error) return false

  // Read/Write grid-map-keys, grid-map-values and grid-metadata
})
