drop database if exists gameCore;

create database if not exists gameCore;

use gameCore;

create table empresa (
id			int auto_increment,
nome		varchar(45),
cnpj		varchar(45),
telefone	char(14),
			primary key(id)
);

create table token (
fk_empresa	int,
codigo		varchar(45),
			primary key(fk_empresa),
            foreign key(fk_empresa) references empresa(id)
);

create table usuario (
id		int auto_increment,
fk_empresa		int,
nome			varchar(45),
email			varchar(45),
cpf				char(15),
senha			varchar(45),
cargo			varchar(45),
				primary key(id),
                foreign key (fk_empresa) references empresa(id)
                
);

create table superior (
id_usuario		int,
id_superior		int,
				primary key(id_usuario, id_superior),
                foreign key(id_usuario) references usuario(id),
                foreign key(id_superior) references usuario(id)
);

create table regiao (
id 			int auto_increment,
regiao 		varchar(45),
descricao	varchar(45),
			primary key(id)
);


create table servidor (
id 				int auto_increment,
hostname 		varchar(45),
ip 				varchar(45),
localizacao 	varchar(45),
fk_regiao		int,
fk_empresa 		int,
				primary key(id),
				foreign key (fk_regiao) references regiao(id),
                foreign key (fk_empresa) references empresa(id)
);


create table log (
id 					int auto_increment,
fk_servidor 		int,
cpu_porcentagem 	char(3),
uso_cpu 			char(3),
uso_ram 			char(3),
uso_memoria 		char(3),
					primary key(id),
					foreign key (fk_servidor) references servidor(id)
);


create table alerta (
id 				int auto_increment,
minimo 			decimal(5,2),
maximo 			decimal(5,2),
componente 		varchar(45),
fk_servidor 	int,
				primary key(id),
				foreign key (fk_servidor) references servidor(id)
);

insert into empresa (nome, cnpj, telefone) values
('GameTech Studios', '12345678000190', '(11)99999-9999'),
('PixelWorks', '98765432000110', '(21)98888-8888'),
('NextLevel Corp', '55123456000155', '(31)97777-7777');

insert into usuario (fk_empresa, nome, email, cpf, senha) values
(1, 'João Silva', 'teste@123', '12345678900', '1234'),
(1, 'Maria Oliveira', 'maria.oliveira@gametech.com', '98765432100', 'senha456'),
(2, 'Carlos Pereira', 'carlos@pixelworks.com', '32165498700', 'senha789'),
(3, 'Ana Costa', 'ana@nextlevel.com', '45612378900', 'senha321');

select * from usuario;

select * from empresa;
