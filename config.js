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
    connectionString: process.env.CUSTOM_CONNSTR_azureStorage
      || 'BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;',
    blobContainerName: 'grid-container',
    gridMapBlobName: 'grid-map',
    gridMetadataBlobName: 'grid-metadata'
  }
}
