import fs from 'fs'
import path from 'path'

const filepath = path.join(__dirname, '../../logs/myfile.txt')

const filechangehandler = (content) => {
  try {
    fs.appendFileSync(filepath, content)
    console.log('file written successfully')
  } catch (err) {
    console.error(err)
  }
}

export default filechangehandler
