const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect
// const assert = chai.assert
const models = require('../src/models')

// small trick for standardJS
console.log(mocha === true)

const testParams = {
  NAME: 'Nich',
  COUNTRY: 'CA',
  ID: '0'
}

const expectedPrimary = 'Customers'
const expectedAll = `Customer_Addresses on Customers.ID=Customer_Addresses.CUSTOMER_ID`
const expectedReport = {
  general: {
    primary: expectedPrimary
  },
  format: {
    Customers: {
      insert: {
        indeces: '(`NAME`,`ID`)',
        values: `('Nich','0')`
      },
      update: {
        values: 'NAME=\'Nich\''
      },
      select: {
        join: expectedAll,
        where: "Customers.NAME='Nich'Customer_Addresses.COUNTRY='CA'Customers.ID='0'"
      },
      delete: {
        where: `\`Customer_Addresses\`.CUSTOMER_ID=\`Customers\`.ID and \`Customers\`.ID='${testParams.ID}'`
      }
    },
    Customer_Addresses: {
      insert: {
        indeces: '(`COUNTRY`,`ID`)',
        values: `('CA','0')`
      },
      update: {
        values: 'COUNTRY=\'CA\''
      },
      select: {
        join: expectedAll,
        where: "Customers.NAME='Nich'Customer_Addresses.COUNTRY='CA'Customers.ID='0'"
      },
      delete: {
        where: `\`Customer_Addresses\`.CUSTOMER_ID=\`Customers\`.ID and \`Customers\`.ID='${testParams.ID}'`
      }
    }
  }
}

describe('Models', _ => {
  // primary
  describe('models.primary', _ => {
    it('should return the name of the primary table', done => {
      expect(models.primary()).to.equal(expectedPrimary)

      done()
    })
  })

  // all
  describe('models.all', _ => {
    it('should return an all models join statement', done => {
      expect(models.all()).to.equal(expectedAll)

      done()
    })
  })

  // report
  describe('models.report', _ => {
    it('should return an object', done => {
      expect(models.report(testParams)).to.be.an('object')

      done()
    })

    it('should return a formatted structure', done => {
      expect(models.report(testParams)).to.eql(expectedReport)

      done()
    })
  })
})
