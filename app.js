const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('morgan')
const swaggerDoc = require('./swaggerJSDoc')
require('dotenv').config()
require('./configs/passport-config')
const { DB_HOST} = process.env
const PORT = process.env.PORT || 3000

// const authRouter = require('./routes/api/auth/authRouter')

const {
  authRouter,
  walletRouter
} = require('./routes/api')

const app = express()
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
swaggerDoc(app)

// app.use(express.static('public'))
app.use('/api/transactions', walletRouter)
app.use('/api/auth', authRouter)




mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => app.listen(PORT, () => {
    console.log(`Database connection successful`)
  })).catch((error) => {
    console.log(error)
    return process.exit(1)
  })

  app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Not found',
  })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
