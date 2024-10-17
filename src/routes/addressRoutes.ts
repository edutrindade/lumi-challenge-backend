import { FastifyInstance } from 'fastify'
import { AddressController, AddressRequestBody } from '@/controllers/addressController'

export async function addressRoutes(server: FastifyInstance) {
   server.post('/', AddressController.createAddress)

   server.get('/', AddressController.getAllAddresses)

   server.get<{ Params: { id: string } }>('/:id', AddressController.getAddressById)

   server.put<{ Params: { id: string }; Body: AddressRequestBody }>('/:id', AddressController.updateAddress)

   server.delete<{ Params: { id: string } }>('/:id', AddressController.deleteAddress)
}
