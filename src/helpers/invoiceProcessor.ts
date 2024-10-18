import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import { prisma } from '../lib/prisma'
import { extractInvoiceFields } from './invoiceExtractor'

export class InvoiceProcessor {
   static async processInvoice(filePath: string) {
      try {
         const dataBuffer = fs.readFileSync(filePath)
         const data = await pdf(dataBuffer)

         console.log('Processando arquivo:', filePath)

         const invoiceData = await extractInvoiceFields(data.text)

         if (invoiceData) {
            const existingInvoice = await prisma.invoice.findFirst({
               where: {
                  referenceMonth: invoiceData.referenceMonth,
                  referenceYear: invoiceData.referenceYear,
                  installationNumber: invoiceData.installationNumber,
               },
            })

            if (existingInvoice) {
               console.log('Fatura já existente:', existingInvoice.id)
               return
            }

            let client = await prisma.client.findFirst({
               where: {
                  clientNumber: invoiceData.client.clientNumber,
               },
            })

            if (!client) {
               console.info('Cliente não encontrado, cadastrando novo cliente: ', invoiceData.client.clientNumber)
               client = await prisma.client.create({
                  data: invoiceData.client,
               })

               console.info('Cadastrando novo endereço para o cliente:', invoiceData.client.clientNumber)
               await prisma.address.create({
                  data: {
                     ...invoiceData.address,
                     clients: {
                        connect: {
                           id: client.id,
                        },
                     },
                  },
               })
            }

            const invoiceDataToSave = {
               installationNumber: invoiceData.installationNumber,
               referenceMonth: invoiceData.referenceMonth,
               referenceYear: invoiceData.referenceYear,
               expirationDate: invoiceData.expirationDate,
               totalValue: invoiceData.totalValue,
               class: invoiceData.class,
               energyAmountKwh: invoiceData.energyAmountKwh,
               energyValue: invoiceData.energyValue,
               energySCEEEKwh: invoiceData.energySCEEEKwh,
               energySCEEValue: invoiceData.energySCEEValue,
               compensatedGDIKwh: invoiceData.compensatedGDIKwh,
               compensatedGDIValue: invoiceData.compensatedGDIValue,
               publicLightingValue: invoiceData.publicLightingValue,
               lastReadingDate: invoiceData.lastReadingDate,
               readingDate: invoiceData.readingDate,
               nextReadingDate: invoiceData.nextReadingDate,
               daysToRead: invoiceData.daysToRead,
               fineForDelay: invoiceData.fineForDelay,
               clientId: client.id,
            }

            console.log('Dados da fatura:', invoiceDataToSave)

            // Cria uma nova fatura no banco de dados
            const newInvoice = await prisma.invoice.create({
               data: invoiceDataToSave,
            })
            console.log('Fatura cadastrada com sucesso: ', newInvoice)
         } else {
            console.error('Não foi possível extrair os dados da fatura:', filePath)
         }
      } catch (error) {
         console.error(`Erro ao processar o arquivo ${filePath}:`, error)
      }
   }

   static async processInvoices() {
      const invoicesDir = path.join(__dirname, '../invoices')
      console.log('Processando faturas na pasta:', invoicesDir)

      fs.readdir(invoicesDir, async (err, files) => {
         if (err) {
            console.error('Erro ao ler a pasta de faturas:', err)
            return
         }

         for (const file of files) {
            const filePath = path.join(invoicesDir, file)
            if (path.extname(file) === '.pdf') {
               await this.processInvoice(filePath)
            }
         }
      })
   }
}
