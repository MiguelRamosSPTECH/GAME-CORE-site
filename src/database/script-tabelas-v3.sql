drop database if exists gamecore;
create database if not exists gamecore;
use gamecore;

create table if not exists empresa(
id int primary key auto_increment,
nomeEmpresarial varchar(30),
cnpj char(14),
email varchar(45),
statusAcesso char(1) default 1
);

create table if not exists cargo(
id int primary key auto_increment,
nome varchar(45),
fk_empresa_cargo int,
ativo BOOLEAN DEFAULT 1,
constraint ct_fkEmpresaCargo foreign key fkempresacargo(fk_empresa_cargo) references empresa(id)
);

create table if not exists funcionario(
id int primary key auto_increment,
nome varchar(50),
email varchar(30),
cpf char(11),
senha varchar(45),
perfilAtivo boolean default 1,
fk_cargo_func int,
-- fk_empresa_func int,
-- constraint ct_fkEmpresa_func foreign key fkempresafunc(fk_empresa_func) references Empresa(id),
constraint ct_fkCargo_func foreign key fkcargofunc(fk_cargo_func) references cargo(id)
);


create table if not exists permissao(
id int primary key auto_increment,
nome varchar(35)
);

create table if not exists permissaocargo(
fk_permissao_pc int,
fk_cargo_pc int,
permissoes int not null,
primary key(fk_permissao_pc, fk_cargo_pc),
constraint ct_fkPermissaoPc foreign key fkpermissaopc(fk_permissao_pc) references permissao(id),
constraint ct_fkCargoPc foreign key fkcargopc(fk_cargo_pc) references cargo(id)
);

CREATE TABLE layout (
	id int primary key auto_increment,
	nome VARCHAR(45),
    emUso tinyint,
    fk_empresa_layout int,
    constraint ct_fkempresalayout foreign key fkempresalayout(fk_empresa_layout) references empresa(id)
);

create table if not exists servidor(
id int primary key auto_increment,
apelido varchar(20),
macadress varchar(20),
localizacao varchar(30),
fk_empresa_servidor int,
fk_layout int,
constraint ct_fkEmpresaServidor foreign key fkempresaservidor(fk_empresa_servidor) references empresa(id),
constraint ct_fkLayoutServidor foreign key fklayoutservidor(fk_layout) references layout(id)
);

create table if not exists metrica(
id int primary key auto_increment,
unidadeMedida varchar(15)

);

create table if not exists componente(
id int primary key auto_increment,
nome varchar(20)

);

create table if not exists configuracaoservidor(
id int primary key auto_increment,
alertaLeve varchar(45),
alertaGrave varchar(45),
fk_metrica_cs int,
fk_componente_cs int,
fk_layout int,
constraint ct_fkMetricaCs foreign key fkmetricacs(fk_metrica_cs) references metrica(Id),
constraint ct_fkComponenteCs foreign key fkcomponentecs(fk_componente_cs) references componente(Id),
constraint ct_LayoutCs foreign key fklayoutcs(fk_layout) references layout(id)
);


-- ----------------------------------------------------------------
-- ESSENCIAL PARA FUNCIONAR O CADASTRO DE SERVIDOR
INSERT INTO componente (nome)
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
        
INSERT INTO metrica (unidadeMedida)
	VALUES 	('%'),
			('MB'),
			('GB'),
            ('MBS'),
			('GBS'),
			('Numérico');
            
-- --------------------------------------------------------------

INSERT INTO empresa (nomeEmpresarial, cnpj, email) VALUES
('Riot Games', '12345678000190', 'contato@riotgames.com'),
('Ubisoft', '98765432000110', 'contato@ubisoft.com'),
('Nintendo', '55123456000155', 'contato@nintendo.com');

INSERT INTO cargo VALUES(null,"Administrador Master",1,1),
						(null, "Engenheiro SRE",1,1),
                        (null, "GAMEOPS",1,1),
                        (null, "GAMECORE",1,1);
INSERT INTO funcionario VALUES (null, "Paulo Silva","psilva@gmail.com","90072845688","12345678",1,1);
INSERT INTO funcionario VALUES (null, "Marcos Silva","msilva@gmail.com","90072845683","12345678",1,2);
INSERT INTO funcionario VALUES (null, "Victor Silva","vsilva@gmail.com","90072845623","12345678",1,3);

INSERT INTO permissao (nome) VALUES 
("DASH ADM"),
("DASH ENG.SRE"),
("DASH GAMEOPS");

# depois adicionar mais permissões para aplicar os esquema tudo la

insert into servidor values (null, "V1.MAIN","10-68-38-9B-8A-08","Ala Sul",1,null);
insert into layout values(null, "DESEMPENHO LÓGICO", 1, 1);
select * from configuracaoservidor;
insert into configuracaoservidor values(null, 54.9, 82.35, 1, 1, 1);
insert into configuracaoservidor values(null, 85.4, 91.6, 1, 6, 1);
insert into configuracaoservidor values(null, 2.8, 12.8, 1, 8, 1);
insert into configuracaoservidor values(null, 44.9, 72.35, 1, 3, 1);
insert into permissaocargo values(1,1,0),
								 (2,2,0),
                                 (3,3,0);
                                 
                                 
DELIMITER $$

CREATE TRIGGER trg_criar_funcionario_adm_master
AFTER INSERT ON cargo
FOR EACH ROW
BEGIN
    -- Declarando variaveis
    DECLARE nomeEmpresa VARCHAR(45);
    DECLARE emailGerado VARCHAR(100);

    -- Garante que só vai executar se for criado um cargo master
    IF NEW.nome = 'Administrador Master' THEN
        
        -- Busca o nome da empresa pra colocar no email
        SELECT nomeEmpresarial INTO nomeEmpresa
        FROM empresa
        WHERE id = NEW.fk_empresa_cargo;

        -- Faz a logica de criar o email, troca espaços por nada e concatena isso com o @ e o .com.br
        SET nomeEmpresa = REPLACE(nomeEmpresa, ' ', '');
        SET emailGerado = CONCAT(LOWER(nomeEmpresa), '@', LOWER(nomeEmpresa), '.com.br');

        -- Insere o funcionário padrão
        INSERT INTO funcionario (nome, email, senha, perfilAtivo, fk_cargo_func)
        VALUES ('Administrador Master', emailGerado, '12345678', 3, NEW.id);
    END IF;
END $$

DELIMITER ;

select * from empresa;
select * from cargo;
select * from permissao;
select * from permissaocargo;
select * from funcionario;
select * from layout;
select * from servidor;
select * from componente;
select * from metrica;
select * from configuracaoservidor;

select c.nome, p.nome from cargo c
inner join permissaocargo ps on
ps.fk_cargo_pc = c.id
inner join permissao p on
p.id = ps.fk_permissao_pc;

-- SELECT QUE RETORNA NOME DE SERVIDOR E OS
-- COMPONENTES / METRICAS SELECIONADAS
-- -- --- --- refazer

# SELECT que retorna o cargo, suas respectivas permissões e a empresa que os detêm
select e.nomeEmpresarial as "Nome da Empresa", c.nome as "Nome do Cargo", p.nome as "Permissões"
from permissaocargo pc
inner join permissao p on p.id = pc.fk_permissao_pc
inner join cargo c on c.id = pc.fk_cargo_pc
inner join empresa e on e.id = c.fk_empresa_cargo;

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


INSERT INTO funcionario (nome, email, cpf, senha, perfilAtivo, fk_cargo_func)
VALUES ('GAMECORE', 'gamecore@empresa.com', '12345678901', '123', 1, 4);


        SELECT f.perfilAtivo
        from Funcionario f
        inner join Cargo c on f.fk_cargo_func = c.id
        inner join Empresa  e on c.fk_empresa_cargo = e.id
        where e.id = 8
        or e.id = 1;
        

select * from empresa;

select * from cargo;

select * from funcionario; 


        SELECT f.perfilAtivo, e.id
        from funcionario f
        inner join cargo c on f.fk_cargo_func = c.id
        inner join empresa  e on c.fk_empresa_cargo = e.id
        where e.id = 2
        or e.id = 1
        order by e.id desc;
        
        
SELECT 
    e.id AS idEmpresa,
    c.id AS idCargo,
    c.ativo
FROM cargo c
INNER JOIN empresa e 
    ON c.fk_empresa_cargo = e.id
WHERE (e.id = 1 OR e.id = 2)
  AND c.nome = 'Administrador Master'
ORDER BY e.id DESC;


select * from cargo;

delete from cargo
where id = 1;

select * from cargo;