import fs from 'fs'
import chalk from 'chalk'
let metadataTemplate = JSON.parse(fs.readFileSync('metadata-template-unrevealed.json'))
const amount = process.argv[2];
const name = process.argv[3];
const image = process.argv[4];

console.log(chalk.green('Generating unrevealed metadata'));

if (!fs.existsSync('unrevealed')){
    fs.mkdirSync('unrevealed')
}
for(let i = 0;i<parseInt(amount);++i){
    let metadata = metadataTemplate
    metadata.name = `${name} #${i}`
    metadata.image = image 
    fs.writeFileSync(`./unrevealed/${i}`,JSON.stringify(metadata))
}
