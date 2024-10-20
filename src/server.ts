import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { addressRoutes } from '@/routes/addressRoutes'
import { clientRoutes } from '@/routes/clientRoutes'
import { invoiceRoutes } from '@/routes/invoiceRoutes'
import path from 'path'
import staticPlugin from '@fastify/static'
import cors from 'fastify-cors'

const prisma = new PrismaClient()
const server = Fastify()

server.register(cors, {
   origin: '*',
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
})

server.register(staticPlugin, {
   root: path.join(__dirname, 'invoices'),
   prefix: '/invoices/',
})

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

server.register(clientRoutes, { prefix: '/api/clients' })
server.register(invoiceRoutes, { prefix: '/api/invoices' })
server.register(addressRoutes, { prefix: '/api/addresses' })

export const startServer = async () => {
   try {
      const PORT = process.env.PORT || 3333
      await server.listen({ port: Number(PORT), host: '0.0.0.0' })

      console.log(`Server running at http://localhost:${PORT} 🚀`)
   } catch (err) {
      console.log(err)
      process.exit(1)
   }
}

startServer()
