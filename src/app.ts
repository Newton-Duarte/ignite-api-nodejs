import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'
// import { checkSessionIdExists } from './middlewares/check-session-id-exists'

export const app = fastify()

app.register(fastifyCookie)
// app.addHook('preHandler', checkSessionIdExists)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})
