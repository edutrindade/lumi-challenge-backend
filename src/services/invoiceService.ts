import { prisma } from '@/lib/prisma'
import { convertMonth, monthMap } from '@/utils/formatDate'
import fs from 'fs'
import path from 'path'

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

   static async getMonthlyTotals(year: string, installationNumber?: string, clientNumber?: string, month?: string) {
      const invoices = await prisma.invoice.findMany({
         where: {
            referenceYear: year,
            ...(installationNumber && { installationNumber }),
            ...(clientNumber && { client: { clientNumber } }),
            ...(month && { referenceMonth: month.toUpperCase() }),
         },
         include: {
            client: true,
         },
      })

      const monthlyTotals = Array.from({ length: 12 }, (_, monthIndex) => {
         const monthAbbreviation = convertMonth(monthIndex + 1)
         const monthlyInvoices = invoices.filter((invoice) => invoice.referenceMonth === monthAbbreviation)

         // Inicializa os totais
         let totalEnergyConsumed = 0
         let totalCompensated = 0
         let totalInvoicesValue = 0
         let totalWithoutGD = 0
         let economyGD = 0

         const clients = monthlyInvoices.map((invoice) => {
            const data = this.calculateVariables(invoice)
            totalEnergyConsumed += data.consumptionKwh.toFixed(2)
            totalCompensated += data.compensatedEnergyKwh.toFixed(2)
            totalInvoicesValue += data.totalValue.toFixed(2)
            totalWithoutGD += data.totalWithoutGD.toFixed(2)
            economyGD += data.economyGD.toFixed(2)

            return {
               id: invoice.client.id,
               name: invoice.client.name,
               number: invoice.client.clientNumber,
               cpfCnpj: invoice.client.cpfCnpj,
            }
         })

         return {
            month: monthAbbreviation,
            year,
            totalEnergyConsumed,
            totalCompensated,
            totalInvoicesValue,
            totalWithoutGD,
            economyGD,
            installationNumbers: monthlyInvoices.map((invoice) => invoice.installationNumber),
            clients,
         }
      })

      const resultsWithVariation = monthlyTotals
         .filter((total) => total)
         .map((total, index) => {
            const previousMonthTotalEnergyConsumed = index > 0 ? monthlyTotals[index - 1].totalEnergyConsumed : 0
            const previousMonthTotalCompensated = index > 0 ? monthlyTotals[index - 1].totalCompensated : 0
            const previousMonthTotalInvoicesValue = index > 0 ? monthlyTotals[index - 1].totalInvoicesValue : 0

            const variationTotalEnergyConsumed =
               previousMonthTotalEnergyConsumed > 0
                  ? ((total.totalEnergyConsumed - previousMonthTotalEnergyConsumed) / previousMonthTotalEnergyConsumed) * 100
                  : 0

            const variationCompensated =
               previousMonthTotalCompensated > 0
                  ? ((total.totalCompensated - previousMonthTotalCompensated) / previousMonthTotalCompensated) * 100
                  : 0

            const variationTotalInvoicesValue =
               previousMonthTotalInvoicesValue > 0
                  ? ((total.totalInvoicesValue - previousMonthTotalInvoicesValue) / previousMonthTotalInvoicesValue) * 100
                  : 0

            if (total.clients.length > 0) {
               return {
                  ...total,
                  variationTotalEnergyConsumed: Number.isNaN(variationTotalEnergyConsumed) ? 0 : variationTotalEnergyConsumed,
                  variationCompensated: Number.isNaN(variationCompensated) ? 0 : variationCompensated,
                  variationTotalInvoicesValue: Number.isNaN(variationTotalInvoicesValue) ? 0 : variationTotalInvoicesValue,
               }
            } else return null
         })

      return resultsWithVariation.filter((total) => total !== null)
   }

   static async getInvoicesForDisplay() {
      const invoices = await prisma.invoice.findMany({
         include: {
            client: true,
         },
      })

      const formattedInvoices = invoices.reduce((acc, invoice) => {
         const { id, clientId, installationNumber, client, referenceMonth, referenceYear } = invoice

         let clientData = acc.find((item) => item.clientId === clientId)
         if (!clientData) {
            clientData = {
               id: id,
               name: client.name,
               clientNumber: client.clientNumber,
               installationNumber: installationNumber,
               distributor: 'CEMIG',
               months: [],
               clientId: clientId,
            }
            acc.push(clientData)
         }

         const monthNum = monthMap(referenceMonth) || '00'
         const fileName = `${installationNumber}-${monthNum}-${referenceYear}.pdf`
         const filePath = path.join(__dirname, '../invoices', fileName)
         const fileUrl = `${process.env.BASE_URL}/invoices/${fileName}`
         const fileExists = fs.existsSync(filePath)

         if (fileExists) {
            clientData.months.push({
               month: referenceMonth,
               year: referenceYear,
               available: true,
               document: fileUrl,
            })
         } else {
            clientData.months.push({
               month: referenceMonth,
               year: referenceYear,
               available: false,
            })
         }

         return acc
      }, [])

      return formattedInvoices
   }

   static calculateVariables(invoice: any) {
      const consumptionKwh = invoice.energyAmountKwh + (invoice.energySCEEEKwh || 0)
      const totalWithoutGD = invoice.energyValue + (invoice.energySCEEValue || 0) + (invoice.publicLightingValue || 0)

      return {
         ...invoice,
         consumptionKwh: consumptionKwh.toFixed(2),
         compensatedEnergyKwh: invoice.compensatedGDIKwh.toFixed(2) || 0,
         totalWithoutGD: totalWithoutGD.toFixed(2),
         economyGD: invoice.compensatedGDIValue.toFixed(2) || 0,
      }
   }
}
