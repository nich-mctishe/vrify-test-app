const mocha = require('mocha')
const { expect, assert } = require('chai')
const Orm = require('../../../modules/orm')
const pool = require('../../../src/database')

console.log(!!mocha)

const sampleModels = require('../../../src/models')

describe('modules -> ORM', _ => {
  // test instantiation
  describe('basic orm requirements', _ => {
    it('instantiates as a class of ORM', done => {
      assert.typeOf(Orm, 'Function')
      assert.typeOf(new Orm({}, {}), 'object')

      done()
    })

    it('has 5 functions (request, insert, update, delete, select)', done => {
      const testOrm = new Orm(pool, sampleModels)
      const methods = testOrm.methods({}, 'GET')

      assert.typeOf(testOrm.request, 'Function')
      assert.typeOf(methods.insert, 'Function')
      assert.typeOf(methods.update, 'Function')
      assert.typeOf(methods.delete, 'Function')
      assert.typeOf(methods.select, 'Function')

      done()
    })

    it('has 1 pulic vars: connection', done => {
      const testOrm = new Orm(pool, sampleModels)

      assert.typeOf(testOrm.connection, 'object')
      expect(testOrm.connection).to.equal(pool)

      done()
    })
    //
    it('does not expose any private variables', done => {
      const testOrm = new Orm(pool, sampleModels)

      assert.typeOf(testOrm.models, 'undefined')

      done()
    })
  })
})
