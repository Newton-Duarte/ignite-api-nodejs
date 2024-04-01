import { describe, expect, it, beforeAll, beforeEach, afterAll } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create an transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New Transaction',
      amount: 3000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to list transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', String(cookies))
      .expect(200)

    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 3000,
      }),
    ])
  })

  it('should be able to get an specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 3000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', String(cookies))
      .expect(200)

    const firstTransaction = listTransactionsResponse.body.transactions[0]

    const response = await request(app.server)
      .get(`/transactions/${firstTransaction.id}`)
      .set('Cookie', String(cookies))
      .expect(200)

    expect(response.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 3000,
      }),
    )
  })

  it('should be able to get transactions summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 3000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', String(cookies))
      .send({
        title: 'New Transaction',
        amount: 1000,
        type: 'debit',
      })
      .expect(201)

    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', String(cookies))
      .expect(200)

    expect(response.body.summary).toEqual({
      amount: 2000,
    })
  })
})
