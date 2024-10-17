// src/controllers/clientController.ts
import { ClientService } from '@/services/clientService'
import { FastifyRequest, FastifyReply } from 'fastify'

export interface ClientRequestBody {
   clientNumber: string
   name: string
   cpfCnpj: string
   email?: string
}

export class ClientController {
   static async createClient(request: FastifyRequest<{ Body: ClientRequestBody }>, reply: FastifyReply) {
      const { clientNumber, name, cpfCnpj, email } = request.body

      const newClient = await ClientService.createClient({
         clientNumber,
         name,
         cpfCnpj,
         email,
      })

      reply.send(newClient)
   }

   static async getAllClients(request: FastifyRequest, reply: FastifyReply) {
      const clients = await ClientService.getAllClients()
      reply.send(clients)
   }

   static async getClientById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const { id } = request.params
      const client = await ClientService.getClientById(id)

      if (client) {
         reply.send(client)
      } else {
         reply.status(404).send({ message: 'Client not found' })
      }
   }

   static async getClientByNumber(request: FastifyRequest<{ Params: { clientNumber: string } }>, reply: FastifyReply) {
      const { clientNumber } = request.params
      const client = await ClientService.getClientByNumber(clientNumber)

      if (client) {
         reply.send(client)
      } else {
         reply.status(404).send({ message: 'Client not found' })
      }
   }

   static async updateClient(request: FastifyRequest<{ Params: { id: string }; Body: ClientRequestBody }>, reply: FastifyReply) {
      const { id } = request.params
      const { clientNumber, name, cpfCnpj, email } = request.body

      const updatedClient = await ClientService.updateClient(id, {
         clientNumber,
         name,
         cpfCnpj,
         email,
      })

      reply.send(updatedClient)
   }

   static async deleteClient(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const { id } = request.params

      await ClientService.deleteClient(id)
      reply.send({ message: 'Client removed successfully' })
   }
}
