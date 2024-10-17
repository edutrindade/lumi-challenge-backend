import { FastifyInstance } from 'fastify'
import { ClientController, ClientRequestBody } from '@/controllers/clientController'

export async function clientRoutes(server: FastifyInstance) {
   server.post<{ Body: ClientRequestBody }>('/', ClientController.createClient)

   server.get('/', ClientController.getAllClients)

   server.get<{ Params: { id: string } }>('/:id', ClientController.getClientById)

   server.get<{ Params: { clientNumber: string } }>('/number/:clientNumber', ClientController.getClientByNumber)

   server.put<{ Params: { id: string }; Body: ClientRequestBody }>('/:id', ClientController.updateClient)

   server.delete<{ Params: { id: string } }>('/:id', ClientController.deleteClient)
}
