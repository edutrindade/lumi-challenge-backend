import { AddressService } from '@/services/addressService'
import { FastifyRequest, FastifyReply } from 'fastify'

export interface AddressRequestBody {
   clientIds: string[]
   street: string
   number: string
   complement?: string
   district: string
   city: string
   state: string
   zipCode: string
}

export class AddressController {
   static async createAddress(request: FastifyRequest<{ Body: AddressRequestBody }>, reply: FastifyReply) {
      const { clientIds, street, number, complement, district, city, state, zipCode } = request.body

      const newAddress = await AddressService.createAddress({
         clients: {
            connect: clientIds.map((id: string) => ({ id })),
         },
         street,
         number,
         complement: complement || undefined,
         district,
         city,
         state,
         zipCode,
      })

      reply.send(newAddress)
   }

   static async getAllAddresses(request: FastifyRequest, reply: FastifyReply) {
      const addresses = await AddressService.getAllAddresses()
      reply.send(addresses)
   }

   static async getAddressById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const { id } = request.params
      const address = await AddressService.getAddressById(id)

      if (address) {
         reply.send(address)
      } else {
         reply.status(404).send({ message: 'Address not found' })
      }
   }

   static async updateAddress(request: FastifyRequest<{ Params: { id: string }; Body: AddressRequestBody }>, reply: FastifyReply) {
      const { id } = request.params
      const { clientIds, street, number, complement, district, city, state, zipCode } = request.body

      const updatedAddress = await AddressService.updateAddress(id, {
         street,
         number,
         complement: complement || undefined,
         district,
         city,
         state,
         zipCode,
         clients: {
            set: clientIds.map((clientId: string) => ({ id: clientId })),
         },
      })

      reply.send(updatedAddress)
   }

   static async deleteAddress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const { id } = request.params

      try {
         await AddressService.deleteAddress(id)
         reply.send({ message: 'Address removed successfully' })
      } catch (error) {
         reply.status(404).send({ message: 'Address not found' })
      }
   }
}
