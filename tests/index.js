// here we will test units and http requests.
const mocha = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../src')
let should = chai.should()

console.log(!!mocha, !!should)

chai.use(chaiHttp)

const sampleEntry = {
  NAME: 'Nicholas',
  COUNTRY: 'CA',
  STREET_ADDRESS: '1234 5th Avenue',
  POSTAL_CODE: 'V6WX7Y'
}
let sampleID = null
let initLength = null

describe('HTTP REST requests', _ => {
  describe('/POST request', () => {
    it('it should POST the sample entry', (done) => {
      chai.request(server)
        .post('/')
        .send(sampleEntry)
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          res.should.have.status(200)
          res.body.should.be.a('object')

          done()
        })
    })
  })
  describe('/GET request', () => {
    it('it should GET all the entries if both tables are populated', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          if (res.body.payload.length > 3) {
            sampleID = res.body.payload[res.body.payload.length - 1].ID
          }

          initLength = res.body.payload.length

          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.payload.length.should.be.at.least(4)

          done()
        })
    })
  })
  describe('/PUT request', () => {
    it('it should PUT and update the sample entry', (done) => {
      sampleEntry.COUNTRY = 'UK'
      sampleEntry.ID = sampleID || 3

      chai.request(server)
        .put('/')
        .send(sampleEntry)
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          res.should.have.status(200)
          res.body.should.be.a('object')

          done()
        })
    })
  })
  describe('single /GET request', () => {
    it('it should return the newly inserted record', (done) => {
      chai.request(server)
        .get('/')
        .send({ ID: sampleID })
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          res.should.have.status(200)
          res.body.status.should.eql(200)
          res.body.should.be.a('object')
          res.body.payload.length.should.eql(1)
          res.body.payload[0].COUNTRY.should.eql(sampleEntry.COUNTRY)

          done()
        })
    })
  })
  describe('/DELETE request', () => {
    it('it should DELETE the sample entry record', (done) => {
      chai.request(server)
        .delete('/')
        .send({ ID: sampleID })
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          res.should.have.status(200)
          res.body.should.be.a('object')

          done()
        })
    })
  })
  describe('delete check /GET request', () => {
    it('it should be one less than the original length of the array', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          res.body.payload.length.should.eql(initLength - 1)

          done()
        })
    })
  })
})
