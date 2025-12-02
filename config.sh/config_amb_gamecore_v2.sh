#!/bin/bash

DOCKER_COMPOSE_VERSION="v2.24.5"



#------------BAIXANDO O DOCKER-----------------#
echo "BAIXANDO DOCKER NA INSTÂNCIA..."

sudo apt-get update 
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "EXECUTANDO ARQUIVO DE INSTALAÇÃO DO DOCKER"

#garante que docker vai funcionar nas proximas linhas de comando, daemon, leva um pouco de tempo
sudo systemctl start docker
sudo systemctl enable docker
sleep 10  

echo "DOCKER baixado e configurado com sucesso!!!"
echo sudo docker -v
#----------------BAIXANDO DOCKER COMPOSE-----------------#
echo "Instalando o docker compose...."

#garante que seja pro LINUX na arquitetura correta (x64, x86) e salva no diretório padrão do sistema p poder usar o comando em todo o SO
sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

#permissao de execucao (precaucao)
sudo chmod +x /usr/local/bin/docker-compose

echo "Versão do docker compose:"
/usr/local/bin/docker-compose version

#-------------------------------------------------------------#

#CONFIGS MYSQL
DIR_CONFIGS="~/config-containers"
COMPOSE_FILE="$DIR_CONFIGS/docker-compose.yml"

#DADOS MYSQL
MYSQL_ROOT_PASSWORD="gamecore123"

echo "Criando diretório de configuração dos containers"
sudo mkdir -p "$DIR_CONFIGS"

echo "Criando arquivo docker-compose.yml..."

sudo cat > "$COMPOSE_FILE" << EOF
version: '3.8'

services:
  site:
    image: miguelramoslimadev/site-gamecore:latest
    container_name: site_gamecore
    restart: unless-stopped
    depends_on:
    - db
    ports:
    - "3333:3333"
  db: 
    image: miguelramoslimadev/atividade-dockerfile:latest    
    container_name: mysql_gamecore
    restart: unless-stopped
    ports:
    - "3306:3306"
    volumes:
    - mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: "$MYSQL_ROOT_PASSWORD"

volumes:
  mysql-data:
EOF

echo "==============================="
echo "Iniciando container MYSQL isolado com o Docker compose men"

cd "$DIR_CONFIGS"
#aqui ele pega o docker-compose.yml executa mas libera o terminal tlgd
sudo /usr/local/bin/docker-compose up -d

echo "VERIFICANDO EXECUÇÃO DOS CONTAINERS"
sudo /usr/local/bin/docker-compose ps
