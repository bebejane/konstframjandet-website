import fs from 'fs'
import { parseDatoError } from '../'

const typeToPath = {
  'news': 'aktuellt',
  'project': 'projekt',
  'about': 'om',
}

const files = fs.readdirSync(__dirname).filter((file) => file.endsWith('.json')).sort((a, b) => a > b ? 1 : -1)

files.forEach((file) => {
  const errors = JSON.parse(fs.readFileSync(`${__dirname}/${file}`, 'utf8'))
  const subdomain = file.split('-')[0]
  const type = file.split('-')[1].replace('.error.json', '')

  console.log(`\n-- ${subdomain} ${type} -----------------------------------`.toUpperCase())
  errors.forEach(({ item, error }) => {
    console.log(`Item: ${item.title}`)
    console.log(parseDatoError({ errors: error.response.body.data }))
    console.log(`https://${subdomain}.konstframjandet.se/${typeToPath[type]}/${item.slug}`)
    console.log('\n')
  })

})
