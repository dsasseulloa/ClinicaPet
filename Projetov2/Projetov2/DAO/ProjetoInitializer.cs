using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Projeto.Models;
namespace Projeto.DAO
{
    public class ProjetoInitializer : System.Data.Entity.DropCreateDatabaseAlways<ProjetoDBContext>
    //DropCreateDatabaseIfModelChanges
    {
        protected override void Seed(ProjetoDBContext context)
        {
            var funcionarios = new List<Funcionario>
            {
                new Funcionario{Nome="Jose",Salario=1000,DataAdmissao=DateTime.Parse("2000-01-01"),DataNascimento=DateTime.Parse("1980-01-01")},
                new Funcionario{Nome="Maria",Salario=1000,DataAdmissao=DateTime.Parse("2000-01-01"),DataNascimento=DateTime.Parse("1980-01-01")},
                new Funcionario{Nome="Gabriel",Salario=1000,DataAdmissao=DateTime.Parse("2000-01-01"),DataNascimento=DateTime.Parse("1980-01-01")},
                new Funcionario{Nome="Joana",Salario=1000,DataAdmissao=DateTime.Parse("2000-01-01"),DataNascimento=DateTime.Parse("1980-01-01")}
            };
            funcionarios.ForEach(s => context.Funcionarios.Add(s));
            context.SaveChanges();

            var Acessos = new List<Acesso>
            {
                new Acesso{FuncionarioID=1,Usuario="admin@admin.com",Senha="123456",Ativo=Ativo.Sim, Perfil="Administrador"},
                new Acesso{FuncionarioID=2,Usuario="Maria",Senha="123456",Ativo=Ativo.Sim, Perfil="Funcionario"},
                new Acesso{FuncionarioID=3,Usuario="Gabriel",Senha="123456",Ativo=Ativo.Sim, Perfil="Funcionario" },
                new Acesso{FuncionarioID=4,Usuario="aadmin@admin.com",Senha="123456",Ativo=Ativo.Sim, Perfil="Administrador"}

            };
            Acessos.ForEach(s => context.Acessos.Add(s));
            context.SaveChanges();

            var clientes = new List<Cliente>
            {
                new Cliente{Nome="Carlos",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678901"},
                new Cliente{Nome="Joaquina",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678902"},
                new Cliente{Nome="Sabrina",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678903"},
                new Cliente{Nome="Roberto",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678904"},
                  new Cliente{Nome="Carlos2",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678905"},
                new Cliente{Nome="Joaquina2",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678906"},
                new Cliente{Nome="Sabrina2",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678907"},
                new Cliente{Nome="Roberto2",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678908"},
                  new Cliente{Nome="Carlos3",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678909"},
                new Cliente{Nome="Joaquina3",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678910"},
                new Cliente{Nome="Sabrina3",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678911"},
                new Cliente{Nome="Roberto3",DataNascimento=DateTime.Parse("01-12-1980"),CPFouRG="12345678912"}
            };
            clientes.ForEach(s => context.Clientes.Add(s));
            context.SaveChanges();


            var Servicos = new List<Servicos>
            {
                new Servicos{Nome="Acupuntura",Preco=100,Descricao="Tratamento de Acupuntura"},
                new Servicos{Nome="Eletroacupuntura",Preco=100,Descricao="Tratamento de Eletroacupuntura"},
                new Servicos{Nome="Moxabustao",Preco=100,Descricao="Tratamento de Moxabustao"},
                new Servicos{Nome="Ozonioterapia",Preco=100,Descricao="Tratamento de Ozonioterapia"},
                new Servicos{Nome="Hidroterapia",Preco=100,Descricao="Tratamento de Hidroterapia"},
                new Servicos{Nome="Eletroterapia",Preco=100,Descricao="Tratamento de Eletroterapia"},
                new Servicos{Nome="Magnetoterapia",Preco=100,Descricao="Tratamento de Magnetoterapia"},
                new Servicos{Nome="Laserterapia",Preco=100,Descricao="Tratamento de Laserterapia"},
                new Servicos{Nome="Cinesioterapia",Preco=100,Descricao="Tratamento de Cinesioterapia"},
                new Servicos{Nome="Fototerapia",Preco=100,Descricao="Tratamento de Fototerapia"},
                new Servicos{Nome="Termografia",Preco=100,Descricao="Tratamento de Termografia"},
                new Servicos{Nome="Shockwave",Preco=100,Descricao="Tratamento de Shockwave"},
                new Servicos{Nome="Dieta Natural",Preco=100,Descricao="Tratamento de Dieta Natural"},
                new Servicos{Nome="Homeopatia",Preco=100,Descricao="Tratamento de Homeopatia"},
                new Servicos{Nome="Reiki",Preco=100,Descricao="Tratamento de Reiki"},
                new Servicos{Nome="Florais",Preco=100,Descricao="Tratamento de Florais"},
                new Servicos{Nome="Outro",Preco=100,Descricao="Outro"},
            };
            Servicos.ForEach(s => context.Servicos.Add(s));
            context.SaveChanges();



            var animais = new List<Animal>
            {
              
                new Animal{AnimalID=2,Nome="pet 2",Sexo="Macho",Sangue=Sangue.apositivo,Nascimento=DateTime.Parse("1980-01-01"),Idade=5,Entrada=DateTime.Parse("2019-08-10"),ClienteID=1,Preco=1000 },
                new Animal{AnimalID=3,Nome="pet 3",Sexo="Macho",Sangue=Sangue.apositivo,Nascimento=DateTime.Parse("1980-01-01"),Idade=5,Entrada=DateTime.Parse("2019-08-10"),ClienteID=1,Preco=1000 }
            };
            animais.ForEach(s => context.Animals.Add(s));
            context.SaveChanges();

        }
    }

}
