const { expect } = require('@jest/globals')
const path = require('path')
const connectToDB = require('./connect')

describe('DB Connection Tests', () => {

  test('it should connect with envronment file', async () => {
    require('dotenv').config({
      path: path.resolve(process.cwd(), './', '.env.local')
    })
    const useDBConfig = {
      mdbHost: process.env['MONGO_DB_HOST'] || 'localhost',
      mdbPort: process.env['MONGO_DB_PORT'] || '21017',
      mdbDB: process.env['MONGO_DB_DB'] || 'test',
      mdbUser: process.env['MONGO_DB_USER'] || 'test',
      mdbPassword: process.env['MONGO_DB_PASSWORD'] || '',
    }

    const sql = await connectToDB({ ...useDBConfig })
    expect(sql).toBeDefined()

    return sql.close()
  })

  test('it should not connect with wrong values', async () => {

    require('dotenv').config({
      path: path.resolve(process.cwd(), './', '.env.local')
    })
    const useDBConfig = {
      mdbHost: process.env['MONGO_DB_HOST'] || 'localhost',
      mdbPort: process.env['MONGO_DB_PORT'] || '21017',
      mdbDB: process.env['MONGO_DB_DB'] || 'test',
      mdbUser: process.env['MONGO_DB_USER'] || 'test',
      mdbPassword: '',
    }

    try {
      const sql = await connectToDB({ ...useDBConfig })
      expect(sql).toBeUndefined()
    } catch (e) {
      expect(e).toBeDefined()
    }

  })
})