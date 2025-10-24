drop database if exists gameCore;
create database if not exists gameCore;
use gameCore;

create table if not exists Empresa(
id int primary key auto_increment,
nomeEmpresarial varchar(30),
cnpj char(14),
email varchar(45),
-- statusOperacao varchar(45),
statusAcesso boolean default 1
);

create table if not exists Cargo(
id int primary key auto_increment,
nome varchar(45),
fk_empresa_cargo int,
ativo BOOLEAN DEFAULT 1,
constraint ct_fkEmpresaCargo foreign key fkempresacargo(fk_empresa_cargo) references Empresa(id)
);

create table if not exists Funcionario(
id int primary key auto_increment,
nome varchar(50),
email varchar(30),
cpf char(11),
senha varchar(45),
perfilAtivo boolean default 1,
-- userMaster boolean default 0,
fk_cargo_func int,
-- fk_empresa_func int,
-- constraint ct_fkEmpresa_func foreign key fkempresafunc(fk_empresa_func) references Empresa(id),
constraint ct_fkCargo_func foreign key fkcargofunc(fk_cargo_func) references Cargo(id)
);

create table if not exists Permissao(
id int primary key auto_increment,
nome varchar(35)
);

create table if not exists PermissaoCargo(
fk_permissao_pc int,
fk_cargo_pc int,
permissoes int not null,
primary key(fk_permissao_pc, fk_cargo_pc),
constraint ct_fkPermissaoPc foreign key fkpermissaopc(fk_permissao_pc) references Permissao(id),
constraint ct_fkCargoPc foreign key fkcargopc(fk_cargo_pc) references Cargo(id)
);

CREATE TABLE layout (
	id int primary key auto_increment,
	nome VARCHAR(45),
    emUso tinyint,
    fk_empresa_layout int,
    constraint ct_fkempresalayout foreign key fkempresalayout(fk_empresa_layout) references Empresa(id)
);

create table if not exists Servidor(
id int primary key auto_increment,
apelido varchar(20),
macadress varchar(20),
localizacao varchar(30),
fk_empresa_servidor int,
fk_layout int,
constraint ct_fkEmpresaServidor foreign key fkempresaservidor(fk_empresa_servidor) references Empresa(id),
constraint ct_fkLayoutServidor foreign key fklayoutservidor(fk_layout) references layout(id)
);

create table if not exists Metrica(
id int primary key auto_increment,
unidadeMedida varchar(15)

);

create table if not exists Componente(
id int primary key auto_increment,
nome varchar(20)

);

create table if not exists ConfiguracaoServidor(
id int primary key auto_increment,
alertaLeve varchar(45),
alertaGrave varchar(45),
fk_metrica_cs int,
fk_componente_cs int,
fk_layout int,
constraint ct_fkMetricaCs foreign key fkmetricacs(fk_metrica_cs) references Metrica(Id),
constraint ct_fkComponenteCs foreign key fkcomponentecs(fk_componente_cs) references Componente(Id),
constraint ct_LayoutCs foreign key fklayoutcs(fk_layout) references layout(id)
);


-- ----------------------------------------------------------------
-- ESSENCIAL PARA FUNCIONAR O CADASTRO DE SERVIDOR
INSERT INTO Componente (nome)
	VALUES 	('CPU'),
			('CPU_OCIOSA'),
            ('CPU_USUARIOS'),
            ('CPU_SISTEMA'),
            ('CPU_LOADAVG'),
			('RAM'),
            ('RAM_DISP'),
            ('RAM_SWAP'),
            ('DISCO'),
            ('DISCO_LIVRE'),
            ('DISCO_THROUGHPUT'),
            ('REDE');
        
INSERT INTO Metrica (unidadeMedida)
	VALUES 	('%'),
			('MB'),
			('GB'),
            ('MBS'),
			('GBS'),
			('Numérico');
            
-- --------------------------------------------------------------

INSERT INTO Empresa (nomeEmpresarial, cnpj, email) VALUES
('Riot Games', '12345678000190', 'contato@riotgames.com'),
('Ubisoft', '98765432000110', 'contato@ubisoft.com'),
('Nintendo', '55123456000155', 'contato@nintendo.com');



INSERT INTO Permissao (nome) VALUES 
("Dashboard de Analista"),
("Dashboard de Suporte"),
("Cadastro de Funcionário"),
("Edição de Funcionário"),
("Cadastro de Servidor"),
("Criação de Cargo");


select * from Empresa;
select * from Cargo;
select * from Permissao;
select * from PermissaoCargo;
select * from Funcionario;
select * from layout;
select * from Servidor;
select * from componente;
select * from metrica;
select * from ConfiguracaoServidor;

-- SELECT QUE RETORNA NOME DE SERVIDOR E OS
-- COMPONENTES / METRICAS SELECIONADAS
-- -- --- --- refazer

# SELECT que retorna o cargo, suas respectivas permissões e a empresa que os detêm
select e.nomeEmpresarial as "Nome da Empresa", c.nome as "Nome do Cargo", p.nome as "Permissões"
from PermissaoCargo pc
inner join Permissao p on p.id = pc.fk_permissao_pc
inner join Cargo c on c.id = pc.fk_cargo_pc
inner join Empresa e on e.id = c.fk_empresa_cargo;

select * from servidor;
select * from layout;
delete from layout where id = 3;
insert into servidor values (null, "V1.MAIN","10-68-38-9B-8A-08","Ala Sul",1,null);
insert into layout values(null, "DESEMPENHO LÓGICO", 1);
select * from configuracaoservidor;
insert into configuracaoservidor values(null, 80, 90, 1, 2, 1);
insert into configuracaoservidor values(null, 90, 95, 1, 1, 1);
#-----------------------------------------------------------
##SCRIPTS ETL

#select  que retorna c omponentes e metricas de um layout especifico
select cs.alertaLeve,cs.alertaGrave, componente.nome, metrica.unidadeMedida from configuracaoservidor cs
inner join 
componente on 
cs.fk_componente_cs = componente.id
inner join metrica on
cs.fk_metrica_cs = metrica.id
where fk_layout = 1;


select l.id, l.nome, c.nome, m.unidadeMedida, l.emUso from empresa e
inner join layout l on
e.id = l.fk_empresa_layout
inner join configuracaoservidor cs on
cs.fk_layout =  l.id
inner join componente c on
c.id = cs.fk_componente_cs
inner join metrica m on
m.id = cs.fk_metrica_cs
where e.id = 4;
