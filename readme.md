![](https://uploads-ssl.webflow.com/62f9249c43126cafce10bc33/62ffcb77b4351b3d229aa6a9_logo-lumi-green.svg)

Este projeto é o backend para o teste prático da **Lumi**, um sistema de processamento de faturas de energia elétrica da CEMIG (Companhia Energética de Minas Gerais). O sistema lê faturas em formato PDF e popula as tabelas no banco de dados PostgreSQL de acordo com o modelo sugerido, extraindo dados como informações da fatura, valores de energia, consumo, multas por atraso, e informações do cliente.

## Objetivos Gerais

* Extrair os dados relevantes dessas faturas.
* Organizar esses dados de maneira estruturada em um banco de dados PostgreSQL.
* Apresentar esses dados em uma aplicação web, por meio de uma API.

## Funcionalidades

* Leitura de faturas em PDF da CEMIG.
* Extração de dados detalhados da fatura.
* Armazenamento das informações no banco de dados PostgreSQL.
* Validação de dados usando **Zod** para garantir integridade.
* Organização das faturas e clientes com base em um modelo relacional.

## Tecnologias Utilizadas

* **Node.js** : Ambiente de execução JavaScript no backend.
* **TypeScript** : Tipagem estática e mais segurança no código.
* **Fastify** : Framework de alto desempenho para servidores HTTP.
* **Prisma** : ORM para comunicação com o banco de dados PostgreSQL.
* **Zod** : Validação de esquema de dados.
* **dotenv** : Gerenciamento de variáveis de ambiente.
* **pdf-parse** : Extração de texto e dados de arquivos PDF.
* **Husky** : Automatização de tarefas antes dos commits (pre-commit hooks).
* **ESLint e Prettier** : Ferramentas para linting e formatação de código.

## Instalação

1. **Clone o repositório** :

```b
git clone https://github.com/seu-usuario/lumi-challenge-backend.git
cd lumi-challenge-backend
```

2. **Instale as dependências** :
   Certifique-se de ter o Node.js instalado. Em seguida, execute:

```bash
npm install
```

3. **Configuração do banco de dados** :
   O sistema usa um banco de dados PostgreSQL. Crie um arquivo `.env` com a URL de conexão ao banco de dados (ver .env.example para mais informações):

```b
DATABASE_URL="postgresql://usuario:senha@localhost:5432/seu_banco_de_dados"
```

4. **Configuração das variáveis de ambiente** :
   Organize o arquivo `.env` na raiz do projeto com as seguintes variáveis:

```PDATABASE_URL=
PORT=opcional
DATABASE_URL="sua-url-do-banco-de-dados"
```

5. **Executando as migrações** :
   Para criar as tabelas no banco de dados conforme o modelo Prisma:

```
npx prisma migrate dev
```

## Como Executar

### Ambiente de Desenvolvimento

Para iniciar o servidor em ambiente de desenvolvimento, utilize:

```
npm run start:dev
```

O servidor será iniciado em modo de desenvolvimento e qualquer alteração no código irá reiniciar automaticamente o servidor.

### Compilar e Construir

Para compilar o projeto TypeScript para JavaScript:

```
npm run build
```

### Linting

Para verificar problemas de formatação e código com  **ESLint** :

```
npm run lint
```

## Estrutura do Banco de Dados

O banco de dados é estruturado em três principais modelos: `Invoice`, `Address` e `Client`.

### Modelo `Invoice` (Fatura)

As faturas extraídas do PDF são armazenadas com os seguintes campos:

* `id`: Identificador único (UUID)
* `clientId`: Identificador do cliente relacionado
* `installationNumber`: Número de instalação
* `referenceMonth`: Mês de referência da fatura
* `referenceYear`: Ano de referência da fatura
* `expirationDate`: Data de vencimento
* `totalValue`: Valor total da fatura
* `energyAmountKwh`: Quantidade de energia em kWh
* `energyValue`: Valor da energia elétrica faturado
* `publicLightingValue`: Valor de contribuição com iluminação pública
* Outros campos opcionais para valores de compensações e multas.

### Modelo `Address` (Endereço)

O endereço do cliente é armazenado separadamente e está relacionado ao cliente:

* `id`: Identificador único (UUID)
* `street`: Nome da rua
* `number`: Número do endereço
* `complement`: Complemento do endereço (opcional)
* `district`: Bairro
* `city`: Cidade
* `state`: Estado
* `zipCode`: Código postal (CEP)

### Modelo `Client` (Cliente)

Os dados do cliente são organizados com informações básicas e a relação com suas faturas e endereço:

* `id`: Identificador único (UUID)
* `clientNumber`: Número do cliente (único)
* `name`: Nome do cliente
* `cpfCnpj`: CPF ou CNPJ do cliente (único)
* `addressId`: Relacionamento com o modelo de endereço (opcional)

## Aplicação Web

Este projeto é complementado por uma **Aplicação Web** onde será possível visualizar os dados processados de forma mais intuitiva e detalhada. A dashboard faz parte deste mesmo ecossistema, permitindo a visualização das faturas processadas e outras funcionalidades relacionadas.

**Sobre o Desenvolvedor**

Este projeto foi desenvolvido por mim, **Eduardo Trindade**. Sou desenvolvedor full stack com foco em React Native, ReactJs e Node.js. Estou sempre buscando entregar soluções eficientes e robustas. Caso tenha dúvidas ou sugestões sobre este projeto, fique à vontade para entrar em contato 🙂.

[www.edutrindade.com.br](www.edutrindade.com.br)
