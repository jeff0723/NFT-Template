import fs, { existsSync, mkdirSync } from 'fs'

let jsonList = fs.readFileSync('imageHash.json')
jsonList = JSON.parse(jsonList)
for(let json of jsonList){
    const id = Object.keys(json)[0]
    const cid = Object.values(json)[0]
    let metadata = JSON.parse(fs.readFileSync(`./metadata/${id}.json`))
    metadata.image = `ipfs://${cid}`
    if(!existsSync('newMetadata')){
        fs.mkdirSync('newMetadata')
    }
    fs.writeFileSync(`./newMetadata/${id}`,JSON.stringify(metadata))
}