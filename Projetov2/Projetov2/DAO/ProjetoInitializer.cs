using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Projeto.Models;
namespace Projeto.DAO
{
    public class ProjetoInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<ProjetoDBContext>
    //DropCreateDatabaseIfModelChanges
    //DropCreateDatabaseAlways
    {
        protected override void Seed(ProjetoDBContext context)
        {
            var funcionarios = new List<Funcionario>
            {
                new Funcionario{Nome="Carolina Sasse",Sexo="Feminino",Cargo=Cargo.Administrador,Salario=0,Contato="47988374041",Email="carolinasasse@gmail.com",DataAdmissao=DateTime.Parse("2017-01-01"),DataNascimento=DateTime.Parse("1980-01-01"),CPFouRG="779.320.603-04"},
                new Funcionario{Nome="Maria Costa",Sexo="Feminino",Cargo=Cargo.Nutricionista,Salario=2300,DataAdmissao=DateTime.Parse("2019-08-09"),DataNascimento=DateTime.Parse("1987-03-07"),Contato="47988359573",CPFouRG="779.320.603-03"},
                new Funcionario{Nome="Manuela Lima Azevedo",Sexo="Feminino",Cargo=Cargo.Fisioterapeuta,Salario=2700,DataAdmissao=DateTime.Parse("2017-01-10"),DataNascimento=DateTime.Parse("1982-01-01"),Contato="47988129573",CPFouRG="779.320.603-01"},
                new Funcionario{Nome="Sophia Goncalves ",Sexo="Feminino",Cargo=Cargo.Assistente,Salario=1900,DataAdmissao=DateTime.Parse("2018-08-02"),DataNascimento=DateTime.Parse("1994-01-01"),Contato="4798837534",CPFouRG="779.320.603-05"},
                new Funcionario{Nome="Gabriel Rocha Barros",Sexo="Masculino",Cargo=Cargo.Motorista,Salario=1900,DataAdmissao=DateTime.Parse("2017-03-07"),DataNascimento=DateTime.Parse("1991-01-01"),Contato="47988345773",CPFouRG="779.320.603-02"}
            };
            funcionarios.ForEach(s => context.Funcionarios.Add(s));
            context.SaveChanges();

            var Acessos = new List<Acesso>
            {
                new Acesso{FuncionarioID=1,Usuario="admin@admin.com",Senha="123456",Ativo=Ativo.Sim, Perfil="Administrador"},
                new Acesso{FuncionarioID=2,Usuario="Maria",Senha="123456",Ativo=Ativo.Sim, Perfil="Funcionario"},
                new Acesso{FuncionarioID=3,Usuario="Gabriel",Senha="123456",Ativo=Ativo.Sim, Perfil="Funcionario" },
               

            };
            Acessos.ForEach(s => context.Acessos.Add(s));
            context.SaveChanges();

            var clientes = new List<Cliente>
            {
                new Cliente{Nome="Carlos Joaquim",Contato="47988359573",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="779.320.603-70"},
                new Cliente{Nome="Gabriela Ferreira Pereira",Contato="47988358361",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678902"},
                new Cliente{Nome="Isabelle Silva Almeida",Contato="47988358450",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678903"},
                new Cliente{Nome="Lucas Martins Pereira",Contato="47988351832",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678904"},
                  new Cliente{Nome="Eduardo Melo Correia",Contato="47988357382",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678905"},
                new Cliente{Nome="Bruna Cavalcanti Gomes",Contato="47988351274",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678906"},
                new Cliente{Nome="Julieta Gomes Araujo",Contato="47988351290",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678907"},
                new Cliente{Nome="Matheus Lima Fernandes",Contato="47988313950",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678908"},
                  new Cliente{Nome="Murilo Goncalves Barros",Contato="47982352740",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678909"},
                new Cliente{Nome="Kauan Correia Castro",Contato="47988318670",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678910"},
                new Cliente{Nome="Beatrice Ribeiro Cardoso",Contato="47988351693",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678911"},
                new Cliente{Nome="Otávio Cardoso Araujo",Contato="47988351092",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678912"}
            };
            clientes.ForEach(s => context.Clientes.Add(s));
            context.SaveChanges();


            var Servicos = new List<Servicos>
            {
                new Servicos{Nome="Acupuntura",Preco=100,Descricao="Tratamento de Acupuntura"},
                new Servicos{Nome="Eletroacupuntura",Preco=200,Descricao="Tratamento de Eletroacupuntura"},
                new Servicos{Nome="Moxabustao",Preco=100,Descricao="Tratamento de Moxabustao"},
                new Servicos{Nome="Ozonioterapia",Preco=100,Descricao="Tratamento de Ozonioterapia"},
                new Servicos{Nome="Hidroterapia",Preco=100,Descricao="Tratamento de Hidroterapia"},
                new Servicos{Nome="Eletroterapia",Preco=300,Descricao="Tratamento de Eletroterapia"},
                new Servicos{Nome="Magnetoterapia",Preco=100,Descricao="Tratamento de Magnetoterapia"},
                new Servicos{Nome="Laserterapia",Preco=100,Descricao="Tratamento de Laserterapia"},
                new Servicos{Nome="Cinesioterapia",Preco=100,Descricao="Tratamento de Cinesioterapia"},
                new Servicos{Nome="Fototerapia",Preco=230,Descricao="Tratamento de Fototerapia"},
                new Servicos{Nome="Termografia",Preco=150,Descricao="Tratamento de Termografia"},
                new Servicos{Nome="Shockwave",Preco=100,Descricao="Tratamento de Shockwave"},
                new Servicos{Nome="Dieta Natural",Preco=250,Descricao="Tratamento de Dieta Natural"},
                new Servicos{Nome="Homeopatia",Preco=100,Descricao="Tratamento de Homeopatia"},
                new Servicos{Nome="Reiki",Preco=100,Descricao="Tratamento de Reiki"},
                new Servicos{Nome="Florais",Preco=200,Descricao="Tratamento de Florais"},
                new Servicos{Nome="Outro",Preco=100,Descricao="Outro"},
            };
            Servicos.ForEach(s => context.Servicos.Add(s));
            context.SaveChanges();



            var animais = new List<Animal>
            {
              
                new Animal{AnimalID=1,Nome="Toby",Sexo="Macho",Tipo=Tipo.Cachorro,Sangue=Sangue.apositivo,Idade=5,Entrada=DateTime.Parse("2019-08-10"),ClienteID=1,Preco=1000 },
                new Animal{AnimalID=2,Nome="Rex",Sexo="Macho",Tipo=Tipo.Outro,Sangue=Sangue.apositivo,Idade=5,Entrada=DateTime.Parse("2019-08-10"),ClienteID=1,Preco=1000 },
                 new Animal{AnimalID=3,Nome="Bela",Sexo="Fêmea",Tipo=Tipo.Cachorro,Sangue=Sangue.apositivo,Idade=5,Entrada=DateTime.Parse("2019-08-10"),ClienteID=1,Preco=1000 },
                new Animal{AnimalID=4,Nome="Mel",Sexo="Macho",Tipo=Tipo.Cachorro,Sangue=Sangue.apositivo,Idade=5,Entrada=DateTime.Parse("2019-08-10"),ClienteID=1,Preco=1000 },
                new Animal{AnimalID=5,Nome="Julie",Sexo="Fêmea",Tipo=Tipo.Gato,Sangue=Sangue.apositivo,Idade=5,Entrada=DateTime.Parse("2019-08-10"),ClienteID=1,Preco=1000 },
            };
            animais.ForEach(s => context.Animals.Add(s));
            context.SaveChanges();

        }
    }

}
