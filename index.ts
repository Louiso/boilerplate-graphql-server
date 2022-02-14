import moduleAlias from 'module-alias'

import 'dotenv/config'
import path from 'path'

const activeNewRelic = process.env.NEWRELIC_ENABLED_SERVICE

if(activeNewRelic === 'active')
  require('newrelic')

const { _moduleAliases } = require(path.resolve(process.cwd(), './package.json'))

const aliases = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = path.join(__dirname, _moduleAliases[key])
})

moduleAlias.addAliases(aliases)

require('./src/server')
