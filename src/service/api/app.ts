import express from 'express'
import bodyParser from 'body-parser'

import routes from './routes'

const app = express()

const morgan = require('morgan')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/v1', routes)

export default app
