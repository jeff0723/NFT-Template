import { create, globSource } from "ipfs-http-client";
import chalk from 'chalk'
import fs from 'fs'
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
const file = process.argv[2];
const buffer = fs.readFileSync(`./images/${file}`)
const {cid} = await ipfs.add(buffer,{
    pin: true,
})
console.log(chalk.green(`ipfs://${cid.toString()}`))