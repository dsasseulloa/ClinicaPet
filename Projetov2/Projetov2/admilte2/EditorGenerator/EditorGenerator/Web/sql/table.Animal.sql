-- 
-- Editor SQL for DB table Animal
-- Created by http://editor.datatables.net/generator
-- 

IF object_id('Animal', 'U') is null
	CREATE TABLE Animal (
		[AnimalID] int not null identity,
		[nome] nvarchar(255),
		[clientenome] nvarchar(255),
		[sexo] nvarchar(255),
		[raca] nvarchar(255),
		[tipo] nvarchar(255),
		[pagamento] nvarchar(255),
		[entrada] date,
		[sangue] nvarchar(255),
		[preco] numeric(9,2),
		[idade] numeric(9,2),
		PRIMARY KEY( [AnimalID] )
	);