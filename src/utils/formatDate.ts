const formatDate = (date: Date): string => {
   return date.toISOString().split('T')[0]
}

const convertToDate = (dateStr: string): Date => {
   const [day, month] = dateStr.split('/').map(Number)
   const year = new Date().getFullYear()
   return new Date(year, month - 1, day)
}

const convertMonth = (month: number): string => {
   const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

   return months[month - 1]
}

const monthMap = (month: string): string => {
   const months = {
      JAN: '01',
      FEV: '02',
      MAR: '03',
      ABR: '04',
      MAI: '05',
      JUN: '06',
      JUL: '07',
      AGO: '08',
      SET: '09',
      OUT: '10',
      NOV: '11',
      DEZ: '12',
   }

   return months[month]
}

export { formatDate, convertToDate, convertMonth, monthMap }
