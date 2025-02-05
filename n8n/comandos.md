local_password: Aals1988@@

        
docker volume create n8n_data

docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n start
 

 
n8n
Editor is now accessible via:
http://localhost:5678/

API JS

/generate-pdf

url postman
http://localhost:3000/generate-pdf

url n8n
http://host.docker.internal:3000/generate-pdf



