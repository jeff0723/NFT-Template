source ../.env
upload_file_name=$UPLOAD_UNREVEALED_FILE_NAME
upload_file_amount=$MAX_SUPPLY
upload_metadata_name=$NAME
echo "generate unrevealed metadata with image CID: $upload_file_name"
unrevealed_cid=$(node ipfsUploadSingleFile.js $upload_file_name)
node generateUnrevealedMetadata.js $upload_file_amount $upload_metadata_name $upload_file_name
node ipfsUploadFolder.js unrevealed >> unrevealed_cid.txt
rm -rf unrevealed