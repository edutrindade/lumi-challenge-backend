import { prisma } from '@/lib/prisma'
import { Client } from '@prisma/client'

export class ClientService {
   static async createClient(data: any) {
      return prisma.client.create({
         data,
      })
   }

   static async getAllClients(): Promise<Client[]> {
      return prisma.client.findMany({ include: { address: true, invoices: true } })
   }

   static async getClientById(id: string): Promise<Client | null> {
      return prisma.client.findUnique({
         where: { id },
         include: { address: true, invoices: true },
      })
   }

   static async getClientByNumber(clientNumber: string): Promise<Client | null> {
      return prisma.client.findUnique({
         where: { clientNumber },
         include: { address: true, invoices: true },
      })
   }

   static async updateClient(id: string, data: any) {
      return prisma.client.update({
         where: { id },
         include: { address: true, invoices: true },
         data,
      })
   }

   static async deleteClient(id: string) {
      return prisma.client.delete({
         where: { id },
      })
   }
}
