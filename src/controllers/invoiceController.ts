import { FastifyReply, FastifyRequest } from 'fastify'
import { InvoiceService } from '@/services/invoiceService'
import { InvoiceProcessor } from '@/helpers/invoiceProcessor'

interface InvoiceParams {
   id: string
}

export interface InvoiceRequestBody {
   clientId: string
   installationNumber: string
   referenceMonth: string
   referenceYear: string
   expirationDate: string
   totalValue: number
   class?: string
   energyAmountKwh: number
   energyValue: number
   energySCEEEKwh?: number
   energySCEEValue?: number
   compensatedGDIKwh?: number
   compensatedGDIValue?: number
   publicLightingValue: number
   lastReadingDate?: string
   readingDate?: string
   nextReadingDate?: string
   daysToRead: number
}

export interface InvoiceCheckParams {
   referenceMonth: string
   referenceYear: string
   installationNumber: string
}

export class InvoiceController {
   static async getAllInvoices(req: FastifyRequest, res: FastifyReply) {
      try {
         const invoices = await InvoiceService.getAllInvoices()
         return res.send(invoices)
      } catch (error) {
         return res.status(500).send({ error: 'Failed to fetch invoices' })
      }
   }

   static async createInvoice(request: FastifyRequest<{ Body: InvoiceRequestBody }>, reply: FastifyReply) {
      const {
         clientId,
         installationNumber,
         referenceMonth,
         referenceYear,
         expirationDate,
         totalValue,
         class: invoiceClass,
         energyAmountKwh,
         energyValue,
         energySCEEEKwh,
         energySCEEValue,
         compensatedGDIKwh,
         compensatedGDIValue,
         publicLightingValue,
         lastReadingDate,
         readingDate,
         nextReadingDate,
         daysToRead,
      } = request.body

      const newInvoice = await InvoiceService.createInvoice({
         clientId,
         installationNumber,
         referenceMonth,
         referenceYear,
         expirationDate: new Date(expirationDate),
         totalValue,
         class: invoiceClass || undefined,
         energyAmountKwh,
         energyValue,
         energySCEEEKwh,
         energySCEEValue,
         compensatedGDIKwh,
         compensatedGDIValue,
         publicLightingValue,
         lastReadingDate: lastReadingDate ? new Date(lastReadingDate) : undefined,
         readingDate: new Date(readingDate),
         nextReadingDate: nextReadingDate ? new Date(nextReadingDate) : undefined,
         daysToRead,
      })

      reply.send(newInvoice)
   }

   static async getInvoiceById(request: FastifyRequest<{ Params: InvoiceParams }>, reply: FastifyReply) {
      const { id } = request.params
      const invoice = await InvoiceService.getInvoiceById(id)
      if (invoice) {
         reply.send(invoice)
      } else {
         reply.status(404).send({ message: 'Invoice not found' })
      }
   }

   static async checkInvoiceExists(request: FastifyRequest<{ Querystring: InvoiceCheckParams }>, reply: FastifyReply) {
      const { referenceMonth, referenceYear, installationNumber } = request.query

      if (!referenceMonth || !referenceYear || !installationNumber) {
         return reply
            .status(400)
            .send({ message: 'Missing parameters. Please provide referenceMonth, referenceYear and installationNumber' })
      }

      const invoice = await InvoiceService.checkInvoiceExists(referenceMonth, referenceYear, installationNumber)

      if (invoice) {
         reply.send({ exists: true })
      } else {
         reply.send({ exists: false })
      }
   }

   static async updateInvoice(request: FastifyRequest<{ Params: { id: string }; Body: InvoiceRequestBody }>, reply: FastifyReply) {
      const { id } = request.params
      const {
         clientId,
         installationNumber,
         referenceMonth,
         referenceYear,
         expirationDate,
         totalValue,
         class: invoiceClass,
         energyAmountKwh,
         energyValue,
         energySCEEEKwh,
         energySCEEValue,
         compensatedGDIKwh,
         compensatedGDIValue,
         publicLightingValue,
         lastReadingDate,
         readingDate,
         nextReadingDate,
         daysToRead,
      } = request.body

      try {
         const updatedInvoice = await InvoiceService.updateInvoice(id, {
            clientId,
            installationNumber,
            referenceMonth,
            referenceYear,
            expirationDate: new Date(expirationDate),
            totalValue,
            class: invoiceClass || undefined,
            energyAmountKwh,
            energyValue,
            energySCEEEKwh,
            energySCEEValue,
            compensatedGDIKwh,
            compensatedGDIValue,
            publicLightingValue,
            lastReadingDate: lastReadingDate ? new Date(lastReadingDate) : undefined,
            readingDate: readingDate ? new Date(readingDate) : undefined,
            nextReadingDate: nextReadingDate ? new Date(nextReadingDate) : undefined,
            daysToRead,
         })

         reply.send(updatedInvoice)
      } catch (error) {
         reply.status(404).send({ message: 'Invoice not found' })
      }
   }

   static async deleteInvoice(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const { id } = request.params

      try {
         await InvoiceService.deleteInvoice(id)
         reply.send({ message: 'Invoice removed successfully' })
      } catch (error) {
         reply.status(404).send({ message: 'Invoice not found' })
      }
   }

   static async processInvoices(request: FastifyRequest, reply: FastifyReply) {
      try {
         await InvoiceProcessor.processInvoices()
         reply.send({ success: true, message: 'Faturas processadas com sucesso' })
      } catch (error) {
         reply.status(500).send({ success: false, message: 'Erro ao processar faturas', error })
      }
   }
}
