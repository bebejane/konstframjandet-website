import fs from 'fs'
import { parseDatoError } from './'

const typeToPath = {
  'news': 'aktuellt',
  'project': 'projekt',
  'about': 'om',
}

const baseDir = `${__dirname}/errors`
const files = fs.readdirSync(baseDir).filter((file) => file.endsWith('.json')).sort((a, b) => a > b ? 1 : -1)

files.forEach((file) => {
  const errors = JSON.parse(fs.readFileSync(`${baseDir}/${file}`, 'utf8'))
  const subdomain = file.split('-')[0]
  const type = file.split('-')[1].replace('.error.json', '')

  console.log(`\n-- ${subdomain} ${type} -----------------------------------`.toUpperCase())
  errors.forEach(({ item, error }) => {
    console.log(`Item: ${item?.title}`)
    console.log(error.response?.body?.data ? parseDatoError({ errors: error.response.body.data }) : error)
    console.log(`http://${subdomain}.konstframjandet.se/${typeToPath[type]}/${item?.slug}`)
    console.log('\n')
  })
})
