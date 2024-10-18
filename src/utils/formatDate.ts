const formatDate = (date: Date): string => {
   return date.toISOString().split('T')[0]
}

const convertToDate = (dateStr: string): Date => {
   const [day, month] = dateStr.split('/').map(Number)
   const year = new Date().getFullYear()
   return new Date(year, month - 1, day)
}

export { formatDate, convertToDate }
