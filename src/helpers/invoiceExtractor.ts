import {
   extractAddress,
   extractValue,
   extractValueAbove,
   extractValueBelow,
   extractEnergyValues,
   extractReadingDates,
   extractLastNumber,
   extractClientNameAboveAddress,
} from '@/utils/extractText'
import { getFirstWord, separateWords } from '@/utils/formatText'

interface addressData {
   street: string
   number: string
   complement?: string
   district: string
   city: string
   state: string
   zipCode: string
}

interface clientData {
   clientNumber: string
   name: string
   cpfCnpj: string
}

interface InvoiceData {
   installationNumber: string
   referenceMonth: string
   referenceYear: string
   expirationDate: Date
   totalValue: number
   class: string
   energyAmountKwh: number | null
   energyValue: number | null
   energySCEEEKwh?: number
   energySCEEValue?: number
   compensatedGDIKwh?: number
   compensatedGDIValue?: number
   publicLightingValue: number
   fineForDelay?: number
   lastReadingDate?: Date
   readingDate: Date
   nextReadingDate?: Date
   daysToRead: number
   client: clientData
   address: addressData
}

export async function extractInvoiceFields(text: string): Promise<InvoiceData | null> {
   const invoice: Partial<InvoiceData> = {}

   // Extração de dados
   const installationAndClientNumber = extractValueBelow(text, 'Nº DA INSTALAÇÃO') ?? ''
   const numbers = installationAndClientNumber.split(/\s+/)

   invoice.installationNumber = numbers[0] ?? ''
   const headerRight = extractValueBelow(text, 'Referente a') ?? ''

   const parts = headerRight.trim().split(/\s+/)

   if (parts.length === 3) {
      invoice.referenceMonth = parts[0].split('/')[0]
      invoice.referenceYear = parts[0].split('/')[1]
      invoice.expirationDate = new Date(parts[1].split('/').reverse().join('-'))
      invoice.totalValue = parseFloat(parts[2].replace(',', '.'))
   } else {
      console.warn('Formato inesperado para referência de mês:', parts)
   }

   const classLine1 = extractValueBelow(text, 'Classe') ?? ''
   const classLine2 = extractValueBelow(text, classLine1) ?? ''

   // Separar palavras na primeira linha
   const separatedLine1 = separateWords(classLine1)
   const separatedLine2 = separateWords(classLine2)

   // Extraindo as primeiras palavras
   const classPart1 = getFirstWord(separatedLine1)
   const classPart2 = getFirstWord(separatedLine2)

   invoice.class = `${classPart1} ${classPart2}`.trim()

   const energyAmountKwhStr = extractValue(text, 'Energia Elétrica')
   const { energyAmountKwh, energyValue } = extractEnergyValues(energyAmountKwhStr)
   const energySCEEEKwhStr = extractValue(text, 'Energia SCEE s/ ICMS')
   const { energyAmountKwh: sceeEnergyAmountKwh, energyValue: sceeEnergyValue } = extractEnergyValues(energySCEEEKwhStr, 1, 3)
   const compensatedGDIKwhStr = extractValue(text, 'Energia compensada GD I')
   const { energyAmountKwh: compensatedGDIKwh, energyValue: compensatedGDIValue } = extractEnergyValues(compensatedGDIKwhStr, 1, 3)

   // Atribuindo os valores de energia à invoice
   invoice.energyAmountKwh = energyAmountKwh
   invoice.energyValue = energyValue
   invoice.energySCEEEKwh = sceeEnergyAmountKwh
   invoice.energySCEEValue = sceeEnergyValue
   invoice.compensatedGDIKwh = compensatedGDIKwh
   invoice.compensatedGDIValue = compensatedGDIValue

   const publicLightingValueStr = extractValue(text, 'Contrib Ilum Publica Municipal')
   if (publicLightingValueStr) {
      invoice.publicLightingValue = parseFloat(publicLightingValueStr.replace('R$', '').replace(',', '.').trim())
   }

   const fineForDelayStr = extractValue(text, 'Multa')
   if (fineForDelayStr) {
      const fineForDelay = extractLastNumber(fineForDelayStr)

      if (fineForDelay) {
         invoice.fineForDelay = fineForDelay
      }
   }

   const readingDateStr = extractValueBelow(text, 'Atual')
   const { lastReadingDate, readingDate, daysToRead, nextReadingDate } = extractReadingDates(readingDateStr)

   // Atribuindo os valores de datas à invoice
   invoice.lastReadingDate = lastReadingDate
   invoice.readingDate = readingDate
   invoice.daysToRead = daysToRead
   invoice.nextReadingDate = nextReadingDate

   // Extração de endereço
   const addressLine = extractAddress(text) ?? ''
   const addressParts = addressLine.split(' ')
   const number = addressParts.find((part) => !isNaN(Number(part))) ?? ''

   const streetParts = addressParts.slice(0, addressParts.length - 1).filter((part) => part !== number)
   const street = streetParts.join(' ').trim()

   const complementParts = addressParts.slice(addressParts.length - 1).filter((part) => part !== number)
   const complement = complementParts.join(' ').trim()

   const district = extractValueBelow(text, street) ?? ''
   const lineAfterDistrict = extractValueBelow(text, district) ?? ''

   // Extração de CEP, Cidade e Estado (na mesma linha)
   const [zipCodePart, cityPart] = lineAfterDistrict.split(',').map((part) => part.trim())
   const zipCode = zipCodePart.split(' ')[0] ?? ''
   const city = zipCodePart.split(' ').slice(1).join(' ') ?? ''
   const state = cityPart.split(' ').slice(-1)[0] ?? ''

   invoice.address = {
      street: street ?? '',
      number: number ?? '',
      complement: complement ?? '',
      district: extractValueBelow(text, street) ?? '',
      city: city ?? '',
      state: state ?? '',
      zipCode: zipCode ?? '',
   }

   // Extração de dados do cliente
   invoice.client = {
      clientNumber: numbers[1] ?? '',
      name: extractClientNameAboveAddress(text) ?? '',
      cpfCnpj: extractValue(text, 'CPF') ?? extractValue(text, 'CNPJ') ?? '',
   }

   console.log('Dados extraídos da fatura:', invoice)

   // Verifica se os campos obrigatórios foram extraídos
   if (
      invoice.installationNumber &&
      invoice.client.clientNumber &&
      invoice.referenceMonth &&
      invoice.referenceYear &&
      invoice.expirationDate &&
      invoice.totalValue
   ) {
      return invoice as InvoiceData
   }

   return null
}
