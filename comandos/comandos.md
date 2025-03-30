[Iniciando o n8n local]
docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n start
 
[n8n]
Editor is now accessible via:
http://localhost:5678/

local_password: Aals1988@@

Fechar o n8n [control] + [c]

[URLS]

API JS
/generate-pdf

url no postman local
http://localhost:3000/generate-pdf

url n8n local
http://host.docker.internal:3000/generate-pdf




