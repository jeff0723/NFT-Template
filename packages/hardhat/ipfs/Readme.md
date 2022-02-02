# This is a ipfs upload script.

## These scripts can be used in two scenarios:

1. Create unrevealed blindbox metadata
2. Create revealed blindbox metadata

### For 1. follow the below instructions:

1. Copy your unrevealed image to asset 
2. type ```bash uploadUnrevealed.sh <image_name> <metadata_amount> <metadata_name>```, example: ```bash uploadUnrevealed.sh 1.jpg 10 TEST```
3. After you ran the commnad, the ipfs cid will be in ```unrevealed_cid.txt```

### For 2.follow the below instructions:

1. copy paste your generated image and metadata into root directory with name `images` and `metadata`
2. ```bash uploadRevealed.sh```
3. After you ran the commnad, the ipfs cid will be in ```revealed_cid.txt```
