import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const server = Fastify()

server.get('/healthcheck', async (request, reply) => {
   try {
      await prisma.$queryRaw`SELECT 1`
      reply.send({
         status: 'OK',
         message: 'Server is running successfully',
         database: 'Connected',
      })
   } catch (error) {
      reply.status(500).send({ error: 'Database connection failed' })
   }
})

export const startServer = async () => {
   try {
      const PORT = process.env.PORT || 3000
      await server.listen({ port: Number(PORT), host: '0.0.0.0' })

      console.log(`Server running at http://localhost:${PORT} 🚀`)
   } catch (err) {
      console.log(err)
      process.exit(1)
   }
}

startServer()
