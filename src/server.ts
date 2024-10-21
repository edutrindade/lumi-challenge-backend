import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { addressRoutes } from '@/routes/addressRoutes'
import { clientRoutes } from '@/routes/clientRoutes'
import { invoiceRoutes } from '@/routes/invoiceRoutes'
import path from 'path'
import staticPlugin from '@fastify/static'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

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

server.register(fastifySwagger, {
   swagger: {
      info: {
         title: 'API Documentation',
         description: 'API do sistema com rotas para clientes, faturas e endereços',
         version: '1.0.0',
      },
      host: 'lumi-challenge-backend.onrender.com',
      schemes: process.env.BASE_URL ? ['https'] : ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
   },
})

server.register(fastifySwaggerUi, {
   routePrefix: '/documentation',
   uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
   },
   uiHooks: {
      onRequest: function (request, reply, next) {
         next()
      },
      preHandler: function (request, reply, next) {
         next()
      },
   },
   staticCSP: true,
   transformStaticCSP: (header) => header,
   transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject
   },
   transformSpecificationClone: true,
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
      server.swagger()
   } catch (err) {
      console.log(err)
      process.exit(1)
   }
}

startServer()
