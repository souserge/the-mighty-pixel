module.exports = {
  grid: {
    rows: 256,
    cols: 384,
    initColor: 15
  },

  server: {
    port: process.env.port || process.env.PORT || 1337
  },

  azureBlob: {
    connectionString: 'BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;',
    // storageAccount: ServiceClient.DEVSTORE_STORAGE_ACCOUNT,
    // accessKey: ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY,
    // blobHost: ServiceClient.DEVSTORE_BLOB_HOST,
    blobContainerName: 'grid-container',
    gridMapBlobName: 'grid-map',
    gridMetadataBlobName: 'grid-metadata'
  }
}
