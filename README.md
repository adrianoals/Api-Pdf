---
# 📄 Gerador de Propostas em PDF com Node.js + n8n

Este projeto é uma API em **Node.js** com **Express** que gera arquivos PDF com layout customizado a partir de dados enviados via requisição HTTP. A API é integrada ao **n8n** para automatizar a criação de simulações e propostas comerciais.

---

## 🚀 Funcionalidades

- Geração de PDFs com múltiplas páginas, fundo personalizado e conteúdo dinâmico.
- Armazenamento local dos arquivos em `/pdfs`.
- Download via link direto após geração.
- Expiração automática de PDFs após 1 hora.
- Fluxo de automação no **n8n** com envio de dados via Supabase e geração de PDFs.

---

## 📦 Tecnologias Utilizadas

- Node.js
- Express
- Puppeteer
- n8n (Automação de workflows)
- Supabase (Backend de simulação)
- Docker (para rodar localmente)

---

## 🧱 Estrutura do Projeto

```
📁 root/
│
├── server.js             # API principal
├── /pdfs                 # Diretório onde os PDFs são salvos
└── README.md             # Este arquivo
```

---

## ▶️ Como Rodar o Projeto Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar a API

```bash
node server.js
```

A API estará acessível em:

```
http://localhost:3000/generate-pdf
```

---

## 🧪 Como Rodar o n8n Localmente

### 1. Criar volume e rodar n8n com Docker:

```bash
docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n start
```

### 2. Acessar o editor n8n:

```
http://localhost:5678/
```

---

## 🔁 Fluxo n8n

O workflow no n8n segue as seguintes etapas:

1. **Trigger manual**
2. **Set de dados da proposta (cliente, vendedor, valores, prazos)**
3. **Envio para Supabase (`rpc_criar_simulacao`)**
4. **Geração do HTML com dados dinâmicos**
5. **Requisição POST para `generate-pdf`**
6. **Recebimento da URL do PDF**
7. **Download automático do arquivo gerado**

---

## 🧹 Limpeza de Arquivos

- A pasta `/pdfs` é verificada a cada hora.
- Arquivos com mais de 1 hora de vida são excluídos automaticamente para economizar espaço.

---

## 📥 Endpoint da API

### `POST /generate-pdf`

**Body JSON:**
```json
{
  "html": "<html>...</html>",
  "css": "body { font-family: Arial; }"
}
```

**Resposta:**
```json
{
  "url": "http://localhost:3000/download/documento-1700000000000.pdf"
}
```

---

### `GET /download/:filename`

Faz o download do arquivo PDF gerado.

---

## 🌍 Produção

Se for hospedar o servidor em produção, você deve:

- Subir o `server.js` em um servidor com IP público ou subdomínio (ex: `pdf.suaempresa.com`).
- Remover o uso de `host.docker.internal` no n8n e usar o domínio ou IP real.

---

## 👤 Autor

Adriano Lima Santos  

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

