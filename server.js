const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 🔹 Definir a pasta onde os PDFs serão salvos
const pdfDir = path.join(__dirname, 'pdfs');

// 🔹 Criar a pasta "pdfs" se não existir
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

app.post('/generate-pdf', async (req, res) => {
    try {
        const { html, css } = req.body;
        if (!html) return res.status(400).json({ error: 'HTML content is required' });

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        // 🔹 Definir o tamanho exato do viewport para A4 (210mm x 297mm)
        await page.setViewport({ width: 794, height: 1123 });

        // 🔹 Criar o HTML com fundo embutido diretamente na segunda página
        const fullHtml = `
        <html>
        <head>
            <style>
                ${css || ''}
                @page { size: A4; margin: 0; }
                body { width: 210mm; height: 297mm; margin: 0; padding: 0; }

                .full-page {
                    width: 210mm;
                    height: 297mm;
                    position: relative;
                    page-break-before: always;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }

                .content-background {
                    width: 210mm;
                    height: 297mm;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    page-break-before: always;
                    position: relative;
                    background-image: url('https://simulador.compreconsorcios.com.br/wp-content/uploads/2024/07/PROPOSTA_BG.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }

                .content-container {
                    width: 180mm;
                    padding: 20px;
                    border-radius: 8px;
                    position: relative;
                    z-index: 10;
                }
            </style>
        </head>
        <body>

            <!-- 🔹 Página 1 - Capa -->
            <div class="full-page" style="background-image: url('https://simulador.compreconsorcios.com.br/wp-content/uploads/2024/06/CAPA_PROPOSTA.png');"></div>

            <!-- 🔹 Página 2 - Conteúdo da Proposta com fundo embutido -->
            <div class="content-background">
                <div class="content-container">
                    ${html}
                </div>
            </div>

            <!-- 🔹 Página 3 - Aviso -->
            <div class="full-page" style="background-image: url('https://simulador.compreconsorcios.com.br/wp-content/uploads/2024/07/PROPOSTA_aviso.png');"></div>

            <!-- 🔹 Página 4 - Respeitabilidade -->
            <div class="full-page" style="background-image: url('https://simulador.compreconsorcios.com.br/wp-content/uploads/2024/07/PROPOSTA_RESPEITABILIDADE.png');"></div>

            <!-- 🔹 Página 5 - Atração -->
            <div class="full-page" style="background-image: url('https://simulador.compreconsorcios.com.br/wp-content/uploads/2024/07/PROPOSTA_ATRAIR-1.png');"></div>

        </body>
        </html>`;

        // 🔹 Define o conteúdo da página
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        // 🔹 Caminho do PDF dentro da pasta "pdfs"
        const pdfFilename = `documento-${Date.now()}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFilename);
        
        await page.pdf({
            path: pdfPath, // ✅ Agora o PDF será salvo na pasta "pdfs/"
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        await browser.close();
        
        res.json({ url: `http://localhost:3000/download/${pdfFilename}` });
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// 🔹 Endpoint para fazer download do PDF
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(pdfDir, req.params.filename);
    res.download(filePath, 'documento.pdf', (err) => {
        if (err) res.status(500).send('Erro ao baixar o arquivo.');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});

const PDF_EXPIRATION_HOURS = 1; // 1 hora de expiração

const limparArquivosAntigos = () => {
    const agora = Date.now();

    fs.readdir(pdfDir, (err, arquivos) => {
        if (err) {
            console.error('Erro ao ler a pasta pdfs:', err);
            return;
        }

        arquivos.forEach(arquivo => {
            const caminhoArquivo = path.join(pdfDir, arquivo);

            fs.stat(caminhoArquivo, (err, stats) => {
                if (err) {
                    console.error(`Erro ao obter informações do arquivo ${arquivo}:`, err);
                    return;
                }

                const tempoCriacao = stats.birthtimeMs || stats.ctimeMs; // Tempo de criação/modificação
                const diferencaHoras = (agora - tempoCriacao) / (1000 * 60 * 60); // Converter para horas

                if (diferencaHoras > PDF_EXPIRATION_HOURS) {
                    fs.unlink(caminhoArquivo, err => {
                        if (err) {
                            console.error(`Erro ao excluir o arquivo ${arquivo}:`, err);
                        } else {
                            console.log(`🗑️  Arquivo removido: ${arquivo}`);
                        }
                    });
                }
            });
        });
    });
};

// Agendar a limpeza de arquivos a cada 1 minuto para teste
setInterval(limparArquivosAntigos, 60 * 60 * 1000); // Verificação a cada 1 hora

// Executar a limpeza imediatamente ao iniciar o servidor
limparArquivosAntigos();
