### This is a ipfs upload script.

## These scripts can be used in two scenarios:

1. Create unrevealed blindbox metadata
2. Create revealed blindbox metadata

# For 1. follow the below instructions:

1. Upload a image and get the cid of image
2. Add this cid("ipfs://<cid>") into the `generateUnrevealedMetadata.js`
3. `node generateUnrevealedMetadata.js` and it will generate a folder called `unrevealed`
4. `node ipfsUploadFolder unrevealed` and it will upload the `unrevealed` folder to ipfs, then we record the printed cid.

# For 2.follow the below instructions:

1. copy paste your generated image and metadata into root directory with named `images` and `metadata`
2. `node generateImageHash` to gereate your image cid for each image.
3. `node fill.js` to fill in your image cid to metadata and generate a folder called `newMetadata`
4. `node ipfsUploadFolder newMetadata` and it will upload the `newMetadata` folder to ipfs, then we record the printed cid.
