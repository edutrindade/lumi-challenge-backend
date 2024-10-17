import { prisma } from '@/lib/prisma'

export class InvoiceService {
   static async getAllInvoices() {
      const invoices = await prisma.invoice.findMany()
      return invoices.map((invoice) => this.calculateVariables(invoice))
   }

   static async createInvoice(data: any) {
      return prisma.invoice.create({
         data,
      })
   }

   static async getInvoiceById(id: string) {
      const invoice = await prisma.invoice.findUnique({
         where: { id },
      })

      return this.calculateVariables(invoice)
   }

   static async checkInvoiceExists(referenceMonth: string, referenceYear: string, installationNumber: string) {
      return prisma.invoice.findFirst({
         where: {
            referenceMonth,
            referenceYear,
            installationNumber,
         },
      })
   }

   static async updateInvoice(id: string, data: any) {
      return prisma.invoice.update({
         where: { id },
         data,
      })
   }

   static async deleteInvoice(id: string) {
      return prisma.invoice.delete({
         where: { id },
      })
   }

   static calculateVariables(invoice: any) {
      const consumptionKwh = invoice.energyAmountKwh + (invoice.energySCEEEKwh || 0)
      const totalWithoutGD = invoice.energyValue + (invoice.energySCEEValue || 0) + (invoice.publicLightingValue || 0)

      return {
         ...invoice,
         consumptionKwh,
         compensatedEnergyKwh: invoice.compensatedGDIKwh || 0,
         totalWithoutGD,
         economyGD: invoice.compensatedGDIValue || 0,
      }
   }
}
