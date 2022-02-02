import { create, globSource } from "ipfs-http-client";
// const ipfsGateway = "https://ipfs.io/ipfs/";
import fs, { existsSync, mkdirSync } from 'fs'
import chalk from 'chalk'

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

const addOptions = {
    pin: true,
};
const partSize = 25
const fileNames = fs.readdirSync('./images', 'utf-8')
const folderNumber = Math.ceil(fileNames.length/partSize)  
// this is to prevent uploading folder exist http request limit
for(let i = 0; i < folderNumber; ++i){
    if(!existsSync(`image-part-${i}`)){
        mkdirSync(`image-part-${i}`)
    }
    const part = fileNames.slice(i*partSize,(i+1)*partSize)
    for(let file of part){
        fs.copyFileSync(`./images/${file}`, `image-part-${i}/${file}`)
    }
    console.log(chalk.green(`Finish copy part-${i}`))
}
for(let i = 0 ; i < folderNumber;++i){
    const list = []
    
    for await (const file of ipfs.addAll(globSource(`image-part-${i}`, '**/*'), addOptions)) {
        const { path, cid } = file
        const index = path.split('.')[0]
        list.push({[index]:cid.toString()})
    }
    if(!existsSync('imageHash.json')){
        fs.writeFileSync('imageHash.json',JSON.stringify(list))
    }
    else{
        let jsonList = fs.readFileSync('imageHash.json')
        jsonList = JSON.parse(jsonList)
        jsonList = jsonList.concat(list)
        fs.writeFileSync('imageHash.json',JSON.stringify(jsonList))

    }
    console.log(chalk.blue(`finish writing part-${i}`))
}
console.log(chalk.green('successfully generate image hash!'))

for(let i = 0; i < folderNumber; ++i){
    fs.rmSync(`image-part-${i}`, { recursive: true });
    console.log(chalk.green(`Removed image-part-${i}`))
}