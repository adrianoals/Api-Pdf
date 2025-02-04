# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos necessários para dentro do container
COPY package*.json ./
COPY . .

# Instala as dependências
RUN npm install

# Expõe a porta 3000 para acesso externo
EXPOSE 3000

# Comando para iniciar a API
CMD ["node", "server.js"]
