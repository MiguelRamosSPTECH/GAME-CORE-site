#!/bin/bash
nome_chave_pem=chaveaws

#------------DROPANDO INSTÂNCIA CASO EXISTA-------------#
id_instancia=$(aws ec2 describe-instances \
--filters "Name=tag:Name,Values=web-server-01" "Name=instance-state-name,Values=running" \
--query "Reservations[].Instances[].InstanceId" \
--output text)

if [ -z "$id_instancia" ]; then
  echo "Erro: Nenhuma instância encontrada com o nome web-server-01"
else
  echo "ID da instância encontrado: $id_instancia"
  echo "-- Encerrando instância $id_instancia..."

  aws ec2 terminate-instances \
--instance-ids "$id_instancia" \
--output json
fi

#------------INICIANDO EXCLUSÃO DA CHAVE.PEM LOCAL---------------#
echo "Verificando se o arquivo de chave privada '$nome_chave_pem.pem' existe..."

# O comando 'test -f' verifica se o arquivo é um arquivo regular e existe.
if test -f "$nome_chave_pem.pem"; then
    echo "A chave '$nome_chave_pem.pem' foi encontrada. Removendo..."
    
    # Comando de remoção
    rm -f "$nome_chave_pem.pem"
    
    if [ $? -eq 0 ]; then
        echo "Sucesso: O arquivo '$nome_chave_pem.pem' foi excluído."
        echo "Excluindo par de chaves..."
        sleep 3
        aws ec2 delete-key-pair --key-name "$nome_chave_pem" 2>/dev/null || echo "Key Pair não existia ou erro ao excluir. Prosseguindo."
    else
        echo "Erro: Falha ao excluir o arquivo '$nome_chave_pem.pem'. Verifique as permissões."
    fi
else
    echo "O arquivo '$nome_chave_pem.pem' não foi encontrado neste diretório. Nenhuma ação necessária."
fi


#-----------CRIANDO INSTÂNCIA----------#
id_vpc=$(aws ec2 describe-vpcs --query "Vpcs[0].[VpcId]" --output text)
echo "ID do VPC $id_vpc ..."
echo "================================================"

echo "PEGANDO SECURITY GROUP"
aws ec2 create-security-group --group-name launch-wizard-42 --vpc-id "$id_vpc" --description "grupo_de_seguranca_042" --tag-specifications 'ResourceType=security-group,Tags=[{Key=Name,Value=sg-042}]'
id_sg=$(aws ec2 describe-security-groups --filters Name=group-name,Values=launch-wizard-42 --query "SecurityGroups[0].[GroupId]" --output text)
echo "ID Security Group $id_sg ..."
echo "================================================"

echo "PEGANDO SUBNET"
id_subnet=$(aws ec2 describe-subnets --query "Subnets[0].[SubnetId]" --output text)
echo "ID Subnet $id_subnet ..."
echo "================================================"

echo "CRIANDO CHAVE.PEM"
aws ec2 create-key-pair --key-name $nome_chave_pem --region us-east-1 --query 'KeyMaterial' --output text > $nome_chave_pem.pem
echo "Chave $nome_chave_pem.pem criada com sucesso."

chmod 400 "$nome_chave_pem.pem"

aws ec2 authorize-security-group-ingress --group-id $id_sg --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $id_sg --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $id_sg --protocol tcp --port 3306 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $id_sg --protocol tcp --port 3333 --cidr 0.0.0.0/0

echo "================================================"
echo "CRIANDO INSTANCIA"
aws ec2 run-instances \
  --image-id ami-0360c520857e3138f \
  --count 1 \
  --security-group-ids $id_sg \
  --instance-type t3.micro \
  --subnet-id $id_subnet \
  --key-name $nome_chave_pem \
  --user-data file://config_amb_gamecore_v2.sh \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":20,"VolumeType":"gp3","DeleteOnTermination":true}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name, Value=web-server-01}]'