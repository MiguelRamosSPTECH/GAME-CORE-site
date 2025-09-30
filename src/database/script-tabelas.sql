drop database if exists gameCore;
create database if not exists gameCore;
use gameCore;

create table Empresa(
id int primary key auto_increment,
nome varchar(45),
cnpj char(14),
email varchar(45),
codigo varchar(45),
acesso tinyint

);

create table Funcionario(
id int primary key auto_increment,
nome varchar(45),
email varchar(45),
cpf char(11),
senha varchar(45),
fk_empresa_func int,
constraint ct_fkEmpresa foreign key fkempresafunc(fk_empresa_func) references Empresa(id)

);

create table Cargo(
id int primary key auto_increment,
nome varchar(45),
fk_empresa_cargo int,
fk_funcionario_cargo int,
constraint ct_fkEmpresaCargo foreign key fkempresacargo(fk_empresa_cargo) references Empresa(id),
constraint ct_fkFuncCargo foreign key fkfunccargo(fk_funcionario_cargo) references Funcionario(id)

);

create table Permissao(
id int primary key auto_increment,
nome varchar(45)

);

create table PermissaoCargo(
fk_permissao_pc int,
fk_cargo_pc int,
primary key(fk_permissao_pc, fk_cargo_pc),
constraint ct_fkPermissaoPc foreign key fkpermissaopc(fk_permissao_pc) references Permissao(id),
constraint ct_fkCargoPc foreign key fkcargopc(fk_cargo_pc) references Cargo(id)

);

create table Servidor(
id int primary key auto_increment,
hostName varchar(45),
ip varchar(45),
localizacao varchar(45),
fk_empresa_servidor int,
constraint ct_fkEmpresaServidor foreign key fkempresaservidor(fk_empresa_servidor) references Empresa(id)

);

create table Metrica(
id int primary key auto_increment,
unidadeMedida varchar(45)

);

create table Componente(
id int primary key auto_increment,
nome varchar(45)

);

create table ConfiguracaoServidor(
id int primary key auto_increment,
alertaLeve varchar(45),
alertaGrave varchar(45),
fk_servidor_config int,
fk_metrica_config int,
fk_componente_config int, 
constraint ct_fkServidorConfig foreign key fkservidorconfig(fk_servidor_config) references Servidor(Id),
constraint ct_fkMetricaConfig foreign key fkmetricaconfig(fk_metrica_config) references Metrica(Id),
constraint ct_fkComponenteConfig foreign key fkcomponenteconfig(fk_componente_config) references Componente(Id)

);