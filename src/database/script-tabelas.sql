drop database if exists gameCore;

create database if not exists gameCore;

use GameCore;

create table empresa (
id          int auto_increment,
nome        varchar(45),
cnpj        varchar(45),
telefone    char(14),
codigo      varchar(45),
            primary key(id)
);

create table cargo (
id          int auto_increment,
nome        varchar(45),
nivelAcesso varchar(45),
fk_empresa  int,
            primary key(id),
            foreign key (fk_empresa) references empresa(id)
);

create table usuario (
id          int auto_increment,
nome        varchar(45),
email       varchar(45),
cpf         varchar(45),
senha       varchar(45),
fk_cargo    int,
            primary key(id),
            foreign key (fk_cargo) references cargo(id)
);

create table servidor (
id          int auto_increment,
hostname    varchar(45),
ip          varchar(45),
localizacao varchar(45),
fk_empresa  int,
            primary key(id),
            foreign key (fk_empresa) references empresa(id)
);

create table componente (
id              int auto_increment,
nome            varchar(45),
unidade_medida  char(5),
                primary key(id)
);

create table log (
id              int auto_increment,
fk_servidor     int,
valor           varchar(45),
momento         timestamp,
fk_componente   int,
                primary key(id),
                foreign key (fk_servidor) references servidor(id),
                foreign key (fk_componente) references componente(id)
);

create table parametroAlerta (
id              int auto_increment,
minimo          decimal(5,2),
maximo          decimal(5,2),
fk_servidor     int,
fk_componente   int,
                primary key(id),
                foreign key (fk_servidor) references servidor(id),
                foreign key (fk_componente) references componente(id)
);

create table preCadastro (
idpreCadastro   int auto_increment,
                primary key(idpreCadastro)
);
