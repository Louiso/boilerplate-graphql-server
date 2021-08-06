import moduleAlias from 'module-alias'

import 'dotenv/config'
import path from 'path'

const { _moduleAliases } = require(path.resolve(process.cwd(), './package.json'))

const aliases = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = path.join(__dirname, _moduleAliases[key])
})

moduleAlias.addAliases(aliases)

require('./src/server')
