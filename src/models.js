/**
 * @var {Object} models = map of the database tables and their relationships
 */
const models = {
  Customers: {
    fields: ['ID', 'NAME'],
    relationships: {
      Customer_Addresses: ['ID', 'CUSTOMER_ID']
    }
  },
  Customer_Addresses: {
    fields: ['ID', 'CUSTOMER_ID', 'STREET_ADDRESS', 'POSTAL_CODE', 'COUNTRY'],
    relationships: {
      Customers: ['CUSTOMER_ID', 'ID']
    }
  }
}
/**
 * Primary Table
 * returns the name of the primary table
 *
 * @returns {String}
 */
const primaryTable = () => {
  return Object.keys(models)[0]
}
/**
 * Where
 * format a where statement based on the input parameters
 * @param {Object} params
 *
 * @returns {String}
 */
const where = (params) => {
  let query = ''

  for (const param in params) {
    // for each param look up index in models to find out where it is and att to query
    query += `${claim(param)}.${param}='${params[param]}'`
  }

  return query
}
/**
 * Claim
 * from given index claim table it belongs to and take precedence over first iteration
 * @param {String} index
 *
 * @returns {String}
 */
const claim = (index) => {
  for (const model in models) {
    if (models[model].fields.indexOf(index) > -1) {
      return model
    }
  }
}
/**
 * Join
 * relates to join on two tables
 * @param {String} table1
 * @param {String} table2
 *
 * @returns {String}
 */
const join = (table1, table2) => {
  const relationship = models[table1].relationships[table2]
  // match table name . field = table name . field
  return `${table2} on ${table1}.${relationship[0]}=${table2}.${relationship[1]}`
}
/**
 * Get all
 * returns query for gettting all info <- this is somewhat of a shortcut
 *
 * @returns {Function(join)}
 */
const getAll = () => {
  // could be made more dynamic by iterating through each table and running join() on each and add res to string
  return join('Customers', 'Customer_Addresses')
}
/**
 * Values
 * constructs query stirng identifier based on query parameters and tables
 * @param {Object} params
 * @param {String} table
 * @param {String} method
 *
 * @returns {String}
 */
const values = (params, table, method) => {
  let string = ''
  for (const param in params) {
    if (models[table].fields.indexOf(param) > -1) {
      if (method === 'insert') {
        string += `\`${param}\`,`
      }
      if (method === 'insertValues') {
        string += `'${params[param]}',`
      }
      if (method === 'update' && param !== 'ID') {
        string += `${param}='${params[param]}',`
      }
    }
  }

  return (method.indexOf('insert') > -1)
    ? `(${string.slice(0, -1)})`
    : string.slice(0, -1)
}
/**
 * Report
 * builds collection of query string identifiers for all verb base CRUD actions
 * @param {Object} params = query parameters
 *
 * @returns {Object}
 */
const report = (params) => {
  // setup object
  let rep = {
    general: {
      primary: primaryTable()
    },
    format: {}
  }

  // cycle through models
  for (const table in models) {
    rep.format[table] = {
      insert: {
        indeces: values(params, table, 'insert'),
        values: values(params, table, 'insertValues')
      },
      update: {
        values: values(params, table, 'update')
      },
      select: {
        where: where(params),
        join: getAll()
      },
      delete: {
        where: `\`Customer_Addresses\`.CUSTOMER_ID=\`Customers\`.ID and \`Customers\`.ID='${params['ID']}'`
      }
    }
  }

  return rep
}

module.exports = {
  primary: primaryTable,
  all: getAll,
  report
}
