import { prisma } from '@/lib/prisma'
import { Address } from '@prisma/client'

export class AddressService {
   static async createAddress(data: any) {
      return prisma.address.create({
         data,
      })
   }

   static async getAllAddresses(): Promise<Address[]> {
      return prisma.address.findMany({ include: { clients: true } })
   }

   static async getAddressById(id: string): Promise<Address | null> {
      return prisma.address.findUnique({
         where: { id },
      })
   }

   static async updateAddress(id: string, data: any) {
      return prisma.address.update({
         where: { id },
         data,
      })
   }

   static async deleteAddress(id: string) {
      return prisma.address.delete({
         where: { id },
      })
   }
}
