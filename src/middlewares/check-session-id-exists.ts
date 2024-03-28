import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionid = request.cookies.sessionId

  if (!sessionid) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
