import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
// import { checkSessionIdExists } from './middlewares/check-session-id-exists'

const app = fastify()

app.register(fastifyCookie)
// app.addHook('preHandler', checkSessionIdExists)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server running on port 3333'))
