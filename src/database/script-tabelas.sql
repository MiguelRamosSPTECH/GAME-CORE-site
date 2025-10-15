drop database if exists gameCore;
create database if not exists gameCore;
use gameCore;

create table if not exists Empresa(
id int primary key auto_increment,
nomeEmpresarial varchar(45),
cnpj char(14),
nomeRepresentante varchar(45),
email varchar(45),
-- statusOperacao varchar(45),
statusAcesso boolean default 1

);

create table if not exists Cargo(
id int primary key auto_increment,
nome varchar(45),
fk_empresa_cargo int,
constraint ct_fkEmpresaCargo foreign key fkempresacargo(fk_empresa_cargo) references Empresa(id)

);

create table if not exists Funcionario(
id int primary key auto_increment,
nome varchar(45),
email varchar(45),
cpf char(11),
senha varchar(45),
perfilAtivo boolean default 1,
userMaster boolean default 0,
fk_empresa_func int,
fk_cargo_func int,
constraint ct_fkEmpresa_func foreign key fkempresafunc(fk_empresa_func) references Empresa(id),
constraint ct_fkCargo_func foreign key fkcargofunc(fk_cargo_func) references Cargo(id)

);

create table if not exists Permissao(
id int primary key auto_increment,
nome varchar(45)

);

create table if not exists PermissaoCargo(
fk_permissao_pc int,
fk_cargo_pc int,
primary key(fk_permissao_pc, fk_cargo_pc),
constraint ct_fkPermissaoPc foreign key fkpermissaopc(fk_permissao_pc) references Permissao(id),
constraint ct_fkCargoPc foreign key fkcargopc(fk_cargo_pc) references Cargo(id)

);

create table if not exists Servidor(
id int primary key auto_increment,
hostName varchar(45),
ip varchar(45),
localizacao varchar(45),
fk_empresa_servidor int,
constraint ct_fkEmpresaServidor foreign key fkempresaservidor(fk_empresa_servidor) references Empresa(id)

);

create table if not exists Metrica(
id int primary key auto_increment,
unidadeMedida varchar(45)

);

create table if not exists Componente(
id int primary key auto_increment,
nome varchar(45)

);

create table if not exists ConfiguracaoServidor(
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

-- ----------------------------------------------------------------
-- ESSENCIAL PARA FUNCIONAR O CADASTRO DE SERVIDOR
INSERT INTO Componente (nome)
	VALUES 	('CPU'),
			('RAM'),
            ('Disco'),
            ('Processos'),
            ('Rede');
        
INSERT INTO Metrica (unidadeMedida)
	VALUES 	('%'),
			('MHz'),
			('GHz'),
			('MB'),
			('GB'),
			('TB'),
			('#'),
			('Tempo (s)'),
			('PID'),
			('Mbps'),
			('Pacotes/s');
-- --------------------------------------------------------------

INSERT INTO Empresa (nomeEmpresarial, cnpj, nomeRepresentante, email) VALUES
('Riot Games', '12345678000190', 'Leonardo', 'contato@riotgames.com'),
('Ubisoft', '98765432000110', 'Tibursio', 'contato@ubisoft.com'),
('Nintendo', '55123456000155', 'João', 'contato@nintendo.com');



INSERT INTO Permissao (nome) VALUES 
("Dashboard de Analista"),
("Dashboard de Suporte"),
("Cadastro de Funcionário"),
("Edição de Funcionário"),
("Cadastro de Servidor"),
("Criação de Cargo");

select * from Empresa;
select * from Cargo;
select * from Funcionario;

select * from Servidor;
select * from componente;
select * from metrica;
select * from ConfiguracaoServidor;

-- SELECT QUE RETORNA NOME DE SERVIDOR E OS
-- COMPONENTES / METRICAS SELECIONADAS
select 	cs.id id_config,
		s.hostname hostname_servidor,
        m.unidademedida,
        c.nome componente
from configuracaoServidor as cs
inner join metrica m on m.id = cs.fk_metrica_config
inner join componente c on c.id = cs.fk_componente_config
inner join servidor s on s.id = cs.fk_servidor_config;