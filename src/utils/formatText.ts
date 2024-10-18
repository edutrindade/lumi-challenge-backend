// Função para separar palavras unidas em uma string
const separateWords = (line: string) => {
   const modifiedLine = line.replace(/(?<!^)(?=[A-Z])/g, ' ')
   return modifiedLine
}

// Função para extrair a primeira palavra de uma string
const getFirstWord = (line: string) => {
   const words = line.match(/[\p{L}]+/gu)
   return words ? words[0] : ''
}

export { separateWords, getFirstWord }
