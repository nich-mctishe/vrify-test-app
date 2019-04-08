/**
 * Query
 * queries the database and returns result
 * @param {Function} resolve = Promise resolver
 * @param {Function} reject = Promise reject
 * @Param {Mysql} connection
 * @param {String} query
 *
 * @returns {Function}
 */
const query = (connection, query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result, fields) => {
      if (err) {
        return reject(err)
      }

      return resolve(result)
    })
  })
}
/**
 * @var {Object} verbs = maps function names to http verbs
 */
const verbs = {
  get: 'select',
  put: 'update',
  post: 'insert',
  delete: 'delete'
}

module.exports = class {
  constructor (_connection, _models) {
    /**
     * @var {Object} connection = mysql connection
     */
    this.connection = _connection
    /**
     * @var {Object} models = model schema
     */
    const models = _models
    /**
     * Methods
     * Database crud operations
     * @param {Object} params = query body and paramaters
     * @param {String} verb = crud selector
     *
     * @returns {Function}
     */
    this.methods = (params, verb) => {
      const schema = models.report(params, verbs[verb.toLowerCase()])
      const tables = Object.keys(schema.format)

      return {
        /**
         * Insert
         *
         * @returns {Promise}
         */
        insert: _ => {
          return new Promise((resolve, reject) => {
            if (!Object.keys(params).length) {
              return reject(new Error('no input paramaters supplied'))
            }
            // insert into table one and get result.
            query(this.connection,
              `insert into ${tables[0]} ${schema.format[tables[0]].insert.indeces} values ${schema.format[tables[0]].insert.values}`)
              .then(result => {
                // if no secondary data; return.
                if (!schema.format[tables[1]].insert.indeces.length) {
                  return resolve(result)
                }

                // amend queries to add relational id
                const indeces = schema.format[tables[1]].insert.indeces.slice(0, -1) + ', `CUSTOMER_ID`)'
                const values = schema.format[tables[1]].insert.values.slice(0, -1) + `, ${result.insertId})`
                // insert into secondary
                query(this.connection,
                  `insert into ${tables[1]} ${indeces} values ${values}`)
                  .then(res => resolve('entry created successfully'))
                  .catch(err => reject(err))
              })
              .catch(err => reject(err))
          })
        },
        /**
         * Update
         *
         * @returns {Promise}
         */
        update: _ => {
          return new Promise((resolve, reject) => {
            if (!params.ID) {
              return reject(new Error('no input paramaters supplied'))
            }

            const queryString = `update ${models.primary()} inner join ${models.all()}
              set ${schema.format[tables[0]].update.values + ',' + schema.format[tables[1]].update.values}
              where Customers.ID = '${params.ID}'`

            query(this.connection, queryString)
              .then(res => resolve('entry updated successfully'))
              .catch(err => reject(err))
          })
        },
        /**
         * Delete
         *
         * @returns {Promise}
         */
        delete: _ => {
          return new Promise((resolve, reject) => {
            // delete `Customers`.*, `Customer_Addresses`.* from `Customers`, `Customer_Addresses` where `Customer_Addresses`.CUSTOMER_ID=`Customers`.ID and `Customers`.ID='30'
            query(this.connection, `delete Customers.*, Customer_Addresses.* from Customers, Customer_Addresses where ${schema.format[tables[0]].delete.where}`)
              .then(result => resolve('entry deleted successfully'))
              .catch(err => reject(err))
          })
        },
        /**
         * Select
         *
         * @returns {Promise}
         */
        select: _ => {
          return new Promise((resolve, reject) => {
            const queryString = `select * from ${models.primary()} right join ${schema.format[models.primary()].select.join}
             ${(schema.format[models.primary()].select.where.length ? ` where ${schema.format[models.primary()].select.where}` : '')}`

            query(this.connection, queryString)
              .then(result => resolve(result))
              .catch(err => reject(err))
          })
        }
      }
    }
  }
  /**
   * Request
   * Database request handler
   * @param {String} verb = http verb
   * @param {Object} paramaters = query body and string paramaters
   *
   * @returns {Promise}
   */
  request (verb, parameters) {
    return new Promise((resolve, reject) => {
      this.methods(parameters, verb)[verbs[verb.toLowerCase()]]()
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
