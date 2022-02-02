upload_file_name=$1
upload_file_amount=$2
upload_metadata_name=$3
echo "generate unrevealed metadata with image CID: $upload_file_name"
unrevealed_cid=$(node ipfsUploadSingleFile.js $upload_file_name)
node generateUnrevealedMetadata.js $upload_file_amount $upload_metadata_name $upload_file_name
node ipfsUploadFolder.js unrevealed >> unrevealed_cid.txt
rm -rf unrevealed