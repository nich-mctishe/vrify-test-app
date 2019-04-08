require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const server = express()
const Orm = require('../modules/orm')
const pool = require('./database')
/**
 * ORM
 * Orm controller
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Function}
 */
const orm = (req, res, next) => {
  // get any query vars or body vars
  const db = new Orm(pool, require('./models'))
  db.request(req.method, { ...req.body, ...req.query })
    // use then or cb and write request as req.data
    .then((result) => {
      req.data = result

      next()
    })
    // or use catch
    .catch((err) => {
      req.error = true
      req.message = err

      next()
    })
}
/**
 * Format
 * format the response object
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Function}
 */
const formatter = (req, res, next) => {
  res.statusCide = req.error ? 500 : 200
  req.res = {
    status: req.error ? 500 : 200,
    message: req.message || '',
    payload: req.data || {}
  }

  return next()
}
/**
 * Output
 * Outputs the response and set any headers
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {Function}
 */
const output = (req, res) => {
  // write extra headers here
  return res.json(req.res)
}

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

// could combine all this
// set routes for GET
server.all('*', (req, res, next) => {
  return next()
})

// could put server use statments here.
server.use(orm)
server.use(formatter)
server.use(output)

// set up server
server.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    throw err
  }

  console.log('server ready to accept requests')
})

module.exports = server
