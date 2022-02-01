import fs from 'fs'
let metadataTemplate = JSON.parse(fs.readFileSync('metadata-template.json'))
const image = '<Your image ipfs cid>'
console.log(metadataTemplate)
for(let i = 0;i<6999;++i){
    let metadata = metadataTemplate
    metadata.name = `Template #${i}`
    metadata.image = image 
    fs.writeFileSync(`./unrevealed/${i}`,JSON.stringify(metadata))
}
