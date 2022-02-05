import { create, globSource } from "ipfs-http-client";
import chalk from 'chalk'
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
const dir = process.argv[2];
const {cid} = await ipfs.add(globSource(`./${dir}`, '**/*'),{
    pin: true,
    wrapWithDirectory: true
})
console.log(chalk.green(`ipfs://${cid.toString()}/`))