import { FastifyInstance } from 'fastify'
import { InvoiceCheckParams, InvoiceController, InvoiceRequestBody } from '@/controllers/invoiceController'

export async function invoiceRoutes(server: FastifyInstance) {
   server.post<{ Body: InvoiceRequestBody }>('/', InvoiceController.createInvoice)

   server.get('/', InvoiceController.getAllInvoices)

   server.get<{ Params: { id: string } }>('/:id', InvoiceController.getInvoiceById)

   server.get<{ Querystring: InvoiceCheckParams }>('/check', InvoiceController.checkInvoiceExists)

   server.put<{ Params: { id: string }; Body: InvoiceRequestBody }>('/:id', InvoiceController.updateInvoice)

   server.delete<{ Params: { id: string } }>('/:id', InvoiceController.deleteInvoice)

   server.post('/process', InvoiceController.processInvoices)
}
