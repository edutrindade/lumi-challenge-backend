import { convertToDate } from './formatDate'

// Função auxiliar para encontrar valores com base em palavras-chave
const extractValue = (invoiceText: string, label: string): string | null => {
   const startIndex = invoiceText.indexOf(label)
   if (startIndex === -1) return null

   const valueStartIndex = startIndex + label.length
   const endIndex = invoiceText.indexOf('\n', valueStartIndex)
   const value = endIndex === -1 ? invoiceText.slice(valueStartIndex).trim() : invoiceText.slice(valueStartIndex, endIndex).trim()
   return value
}

// Função auxiliar para encontrar o valor abaixo de uma palavra-chave
const extractValueBelow = (invoiceText: string, label: string): string | null => {
   const startIndex = invoiceText.indexOf(label)
   if (startIndex === -1) return null

   const valueStartIndex = invoiceText.indexOf('\n', startIndex) + 1 // Pega a linha abaixo
   const endIndex = invoiceText.indexOf('\n', valueStartIndex)
   const value = endIndex === -1 ? invoiceText.slice(valueStartIndex).trim() : invoiceText.slice(valueStartIndex, endIndex).trim()
   return value
}

// Função auxiliar para encontrar o valor à esquerda de uma palavra-chave
const extractValueAbove = (invoiceText: string, label: string): string | null => {
   const regex = new RegExp(`^(.*?)\\s*${label}`, 'm')
   const match = invoiceText.match(regex)

   if (!match) return null

   const value = match[1].trim()
   return value || null
}

// Função auxiliar para encontrar um endereço válido
const extractAddress = (invoiceText: string): string | null => {
   const addressKeywords = ['RUA', 'AV ', 'PC ', 'TRAVESSA', 'ALAMEDA', 'LARGO', 'PRAÇA']

   const lines = invoiceText.split('\n')

   for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (addressKeywords.some((keyword) => line.startsWith(keyword))) {
         return line
      }
   }

   return null
}

// Função para extrair o nome do cliente
const extractClientNameAboveAddress = (invoiceText: string): string | null => {
   const addressKeywords = ['RUA', 'AV ', 'PC ', 'TRAVESSA', 'ALAMEDA', 'LARGO', 'PRAÇA']

   const lines = invoiceText.split('\n')

   for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (addressKeywords.some((keyword) => line.startsWith(keyword))) {
         if (i > 0) {
            return lines[i - 1].trim()
         }
         break
      }
   }

   return null
}

// Função para extrair as datas de leitura de uma string
const extractReadingDates = (input: string) => {
   if (!input) return null

   const match = input.match(/(\d{2}\/\d{2})\s*(\d{2}\/\d{2})\s*(\d{1,2})/)

   if (match) {
      const lastReadingDateStr = match[1]
      const readingDateStr = match[2]
      const daysToRead = match[3]
      const nextReadingDateStr = input.substring(input.length - 5)

      const lastReadingDate = convertToDate(lastReadingDateStr)
      const readingDate = convertToDate(readingDateStr)
      const nextReadingDate = convertToDate(nextReadingDateStr)

      return {
         lastReadingDate,
         readingDate,
         daysToRead: parseInt(daysToRead),
         nextReadingDate,
      }
   }
}

// Função para extrair valores de energia de uma string
const extractEnergyValues = (input: string, amountIndex: number = 1, valueIndex: number = 3) => {
   if (!input) return { energyAmountKwh: null, energyValue: null }

   const parts = input.trim().split(/\s+/)

   const energyAmountKwh = parts.length > amountIndex ? parseFloat(parts[amountIndex].replace(',', '.')) : null
   const energyValue = parts.length > valueIndex ? parseFloat(parts[valueIndex].replace(',', '.')) : null

   return {
      energyAmountKwh,
      energyValue,
   }
}

// Função para extrair o último número de uma string
const extractLastNumber = (input: string) => {
   const parts = input.trim().split(/\s+/)
   const numbers = parts.filter((part) => !isNaN(parseFloat(part.replace(',', '.'))))
   const lastNumber = numbers.length > 0 ? parseFloat(numbers[numbers.length - 1].replace(',', '.')) : null

   return lastNumber
}

export {
   extractValueBelow,
   extractValue,
   extractValueAbove,
   extractAddress,
   extractClientNameAboveAddress,
   extractReadingDates,
   extractEnergyValues,
   extractLastNumber,
}
