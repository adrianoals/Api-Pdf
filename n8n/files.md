✅ A API estará rodando no container api-node e acessível em http://api-node:3000 dentro do Docker.
✅ O n8n estará rodando no container n8n e acessível em http://localhost:5678 no navegador.

🔎 Como verificar se tudo está rodando?
Se quiser conferir se os containers estão ativos, rode:


docker ps
Isso mostrará algo como:

CONTAINER ID   IMAGE        COMMAND                  STATUS         PORTS                    NAMES
a1b2c3d4e5f6   api-node     "node server.js"        Up 2 minutes   0.0.0.0:3000->3000/tcp   api-node
f6e5d4c3b2a1   n8nio/n8n    "docker-entrypoint.s…"  Up 2 minutes   0.0.0.0:5678->5678/tcp   n8n

Se os containers estiverem "Up", significa que estão rodando corretamente.

🛑 Como parar os containers?
Se quiser parar a API e o n8n, use:

docker-compose down
Isso irá parar e remover os containers, mas sem deletar os volumes e redes.

Se quiser também remover os volumes, use:

docker-compose down -v
Isso apagará os dados salvos pelos serviços.

🔄 Como reiniciar os containers?
Se você já rodou docker-compose up -d --build pelo menos uma vez, pode apenas usar:

docker-compose up -d
Isso irá iniciar os containers sem precisar reconstruí-los.

🛠️ Se precisar reconstruir a API ou n8n
Se fizer alguma alteração no código da API e precisar reconstruir a imagem, use:


docker-compose up -d --build
Isso recompilará a API e reiniciará os serviços.

📌 Resumo
docker-compose up -d --build → Inicia API e n8n no Docker.
docker ps → Verifica se os containers estão rodando.
docker-compose down → Para e remove os containers.
docker-compose up -d → Reinicia sem recompilar.
docker-compose up -d --build → Reinicia e reconstrói a API.
