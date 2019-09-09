using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Projeto.Models;
using Projeto.Models.Tipos;

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
                new Funcionario{Nome="Administrador",Sexo="Feminino",Cargo=Cargo.Administrador,Salario=0,Contato="47988374041",Email="carolinasasse@gmail.com",DataAdmissao=DateTime.Parse("2017-01-01"),DataNascimento=DateTime.Parse("1980-01-01"),CPFouRG="779.320.603-04"},
                new Funcionario{Nome="Manuela Lima Azevedo",Sexo="Feminino",Cargo=Cargo.Fisioterapeuta,Salario=1700,DataAdmissao=DateTime.Parse("2017-01-10"),DataNascimento=DateTime.Parse("1982-01-01"),Contato="(47)98812-9573",CPFouRG="779.320.603-01"},
                new Funcionario{Nome="Maria Costa",Sexo="Feminino",Cargo=Cargo.Nutricionista,Salario=0,DataAdmissao=DateTime.Parse("2019-08-09"),DataNascimento=DateTime.Parse("1987-03-07"),Contato="(47)98835-9573",CPFouRG="779.320.603-03"}
            };
            funcionarios.ForEach(s => context.Funcionarios.Add(s));
            context.SaveChanges();

            var Acessos = new List<Acesso>
            {
                new Acesso{FuncionarioID=1,Usuario="admin@admin.com",Senha="123456",Ativo=Ativo.Sim, Perfil="Administrador"},
                new Acesso{FuncionarioID=2,Usuario="Manuela",Senha="123456",Ativo=Ativo.Sim, Perfil="Funcionario"},
               
               

            };
            Acessos.ForEach(s => context.Acessos.Add(s));
            context.SaveChanges();

            var clientes = new List<Cliente>
            {
                new Cliente{Nome="Carlos Joaquim",Contato="(47)98835-9573",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="779.320.603-70"},
                new Cliente{Nome="Gabriela Ferreira Pereira",Contato="(47)98835-8361",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="975.945.960-48"},
                new Cliente{Nome="Isabelle Silva Almeida",Contato="(47)98835-8450",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="980.587.910-08"},
                new Cliente{Nome="Lucas Martins Pereira",Contato="(47)98835-1832",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="449.627.880-43"},
                  new Cliente{Nome="Eduardo Melo Correia",Contato="(47)98835-7382",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="684.749.530-81"},
                new Cliente{Nome="Bruna Cavalcanti Gomes",Contato="(47)98835-1274",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="894.027.990-52"},
                new Cliente{Nome="Julieta Gomes Araujo",Contato="(47)98835-1290",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="352.804.330-04"},
                new Cliente{Nome="Matheus Lima Fernandes",Contato="(47)98831-3950",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="189.847.070-74"},
                  new Cliente{Nome="Murilo Goncalves Barros",Contato="(47)98235-2740",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="303.764.640-38"},
                new Cliente{Nome="Kauan Correia Castro",Contato="(47)98831-8670",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="831.142.750-01"},
                new Cliente{Nome="Beatrice Ribeiro Cardoso",Contato="(47)98835-1693",Sexo="Feminino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="116.741.110-29"},
                new Cliente{Nome="Otávio Cardoso Araujo",Contato="(47)98835-1092",Sexo="Masculino",DataNascimento=DateTime.Parse("01-12-1990"),CPFouRG="779.609.040-49"}
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
                new Servicos{Nome="Outro",Preco=100,Descricao="Outro"}
            };
            Servicos.ForEach(s => context.Servicos.Add(s));
            context.SaveChanges();



            var animais = new List<Animal>
            {
              
                new Animal{AnimalID=1,Nome="Toby",Sexo="Macho",Tipo="Cachorro",TipoSangue="DEA 1.2",Idade=5,Entrada=DateTime.Parse("2019-01-10"),ClienteNome="Carlos Joaquim",Preco=950,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=2,Nome="Rex",Sexo="Macho",Tipo="Outro",TipoSangue="B+",Idade=2,Entrada=DateTime.Parse("2019-01-10"),ClienteNome="Otávio Cardoso Araujo",Preco=850,Pagamento="Pago",Raca="S.R.D"},
                 new Animal{AnimalID=3,Nome="Bela",Sexo="Fêmea",Tipo="Cachorro",TipoSangue="DEA 5",Idade=3,Entrada=DateTime.Parse("2019-02-10"),ClienteNome="Gabriela Ferreira Pereira",Preco=1440,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=4,Nome="Mel",Sexo="Fêmea",Tipo="Cachorro",TipoSangue="DEA 1.1",Idade=1,Entrada=DateTime.Parse("2019-03-10"),ClienteNome="Isabelle Silva Almeida",Preco=750,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=5,Nome="Julie",Sexo="Fêmea",Tipo="Gato",TipoSangue="A",Idade=2,Entrada=DateTime.Parse("2019-04-10"),ClienteNome="Beatrice Ribeiro Cardoso",Preco=1450,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=6,Nome="Fubá",Sexo="Macho",Tipo="Cachorro",TipoSangue="DEA 1.2",Idade=11,Entrada=DateTime.Parse("2019-05-10"),ClienteNome="Carlos Joaquim",Preco=1000,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=7,Nome="Duke",Sexo="Macho",Tipo="Outro",TipoSangue="B+",Idade=8,Entrada=DateTime.Parse("2019-05-10"),ClienteNome="Carlos Joaquim",Preco=550,Pagamento="Pendente",Raca="S.R.D"},
                 new Animal{AnimalID=8,Nome="Babi",Sexo="Fêmea",Tipo="Cachorro",TipoSangue="DEA 5",Idade=9,Entrada=DateTime.Parse("2019-05-10"),ClienteNome="Bruna Cavalcanti Gomes",Preco=1300,Pagamento="Pendente",Raca="S.R.D"},
                new Animal{AnimalID=9,Nome="Cacau",Sexo="Fêmea",Tipo="Cachorro",TipoSangue="DEA 1.1",Idade=7,Entrada=DateTime.Parse("2019-07-10"),ClienteNome="Bruna Cavalcanti Gomes",Preco=1250,Pagamento="Pendente",Raca="S.R.D"},
                new Animal{AnimalID=10,Nome="Estrela",Sexo="Fêmea",Tipo="Gato",TipoSangue="A",Idade=4,Entrada=DateTime.Parse("2019-08-10"),ClienteNome="Beatrice Ribeiro Cardoso",Preco=1050,Pagamento="Pendente",Raca="S.R.D"},
                new Animal{AnimalID=11,Nome="Elvis",Sexo="Macho",Tipo="Cachorro",TipoSangue="DEA 1.2",Idade=7,Entrada=DateTime.Parse("2019-01-10"),ClienteNome="Carlos Joaquim",Preco=1050,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=12,Nome="Harry",Sexo="Macho",Tipo="Outro",TipoSangue="B+",Idade=5,Entrada=DateTime.Parse("2019-03-10"),ClienteNome="Carlos Joaquim",Preco=1150,Pagamento="Pago",Raca="S.R.D"},
                 new Animal{AnimalID=13,Nome="Judy",Sexo="Fêmea",Tipo="Cachorro",TipoSangue="DEA 5",Idade=5,Entrada=DateTime.Parse("2019-02-10"),ClienteNome="Isabelle Silva Almeida",Preco=1440,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=14,Nome="Max",Sexo="Macho",Tipo="Cachorro",TipoSangue="DEA 1.1",Idade=8,Entrada=DateTime.Parse("2019-03-10"),ClienteNome="Isabelle Silva Almeida",Preco=950,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=15,Nome="Jasmin",Sexo="Fêmea",Tipo="Gato",TipoSangue="A",Idade=5,Entrada=DateTime.Parse("2019-04-10"),ClienteNome="Beatrice Ribeiro Cardoso",Preco=1450,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=16,Nome="Oliver",Sexo="Macho",Tipo="Cachorro",TipoSangue="DEA 1.2",Idade=9,Entrada=DateTime.Parse("2019-06-10"),ClienteNome="Carlos Joaquim",Preco=1400,Pagamento="Pago",Raca="S.R.D"},
                new Animal{AnimalID=17,Nome="Odie",Sexo="Macho",Tipo="Outro",TipoSangue="B+",Idade=15,Entrada=DateTime.Parse("2019-08-10"),ClienteNome="Carlos Joaquim",Preco=1050,Pagamento="Pendente",Raca="S.R.D"},
                 new Animal{AnimalID=18,Nome="Babi",Sexo="Fêmea",Tipo="Cachorro",TipoSangue="DEA 5",Idade=11,Entrada=DateTime.Parse("2019-06-10"),ClienteNome="Isabelle Silva Almeida",Preco=1400,Pagamento="Pendente",Raca="S.R.D"},
                new Animal{AnimalID=19,Nome="Pimpolho",Sexo="Macho",Tipo="Cachorro",TipoSangue="DEA 1.1",Idade=15,Entrada=DateTime.Parse("2019-07-10"),ClienteNome="Isabelle Silva Almeida",Preco=1540,Pagamento="Pendente",Raca="S.R.D"},
                new Animal{AnimalID=20,Nome="Sandy",Sexo="Fêmea",Tipo="Gato",TipoSangue="A",Idade=10,Entrada=DateTime.Parse("2019-08-10"),ClienteNome="Beatrice Ribeiro Cardoso",Preco=750,Pagamento="Pendente",Raca="S.R.D"}
            };
            animais.ForEach(s => context.Animals.Add(s));
            context.SaveChanges();

            var TipoAnimals = new List<TipoAnimal>
            {
                new TipoAnimal{TipoanimalID=1,Tipoanimal="Outro"},
               new TipoAnimal{TipoanimalID=2,Tipoanimal="Cachorro"},
               new TipoAnimal{TipoanimalID=3,Tipoanimal="Gato"}

            };
            TipoAnimals.ForEach(s => context.TipoAnimals.Add(s));
            context.SaveChanges();

            var TipoSangues = new List<TipoSangue>
            {
                new TipoSangue{TipoSangueID=1,Tiposangue="DEA 1.1",TipoAnimalID=2,Tipoanimal="Cachorro"},
               new TipoSangue{TipoSangueID=2,Tiposangue="DEA 1.2",TipoAnimalID=2,Tipoanimal="Cachorro"},
               new TipoSangue{TipoSangueID=3,Tiposangue="DEA 1.3",TipoAnimalID=2,Tipoanimal="Cachorro"},
                new TipoSangue{TipoSangueID=4,Tiposangue="DEA 3",TipoAnimalID=2,Tipoanimal="Cachorro"},
                 new TipoSangue{TipoSangueID=5,Tiposangue="DEA 4",TipoAnimalID=2,Tipoanimal="Cachorro"},
                 new TipoSangue{TipoSangueID=6,Tiposangue="DEA 5",TipoAnimalID=2,Tipoanimal="Cachorro"},
                  new TipoSangue{TipoSangueID=7,Tiposangue="DEA 7",TipoAnimalID=2,Tipoanimal="Cachorro"},


                new TipoSangue{TipoSangueID=8,Tiposangue="A",TipoAnimalID=3,Tipoanimal="Gato"},
                 new TipoSangue{TipoSangueID=9,Tiposangue="B",TipoAnimalID=3,Tipoanimal="Gato"},
                  new TipoSangue{TipoSangueID=10,Tiposangue="AB",TipoAnimalID=3,Tipoanimal="Gato"},


                  new TipoSangue{TipoSangueID=11,Tiposangue="A",TipoAnimalID=2,Tipoanimal="Outro"},
                  new TipoSangue{TipoSangueID=12,Tiposangue="A+",TipoAnimalID=2,Tipoanimal="Outro"},
                  new TipoSangue{TipoSangueID=13,Tiposangue="B",TipoAnimalID=2,Tipoanimal="Outro"},
                  new TipoSangue{TipoSangueID=14,Tiposangue="B-",TipoAnimalID=2,Tipoanimal="Outro"},
                  new TipoSangue{TipoSangueID=15,Tiposangue="AB+",TipoAnimalID=2,Tipoanimal="Outro"},
                  new TipoSangue{TipoSangueID=16,Tiposangue="AB-",TipoAnimalID=2,Tipoanimal="Outro"},
                  new TipoSangue{TipoSangueID=17,Tiposangue="O+",TipoAnimalID=2,Tipoanimal="Outro"},
                  new TipoSangue{TipoSangueID=18,Tiposangue="O-",TipoAnimalID=2,Tipoanimal="Outro"},
                  


            };
            TipoSangues.ForEach(s => context.TipoSangues.Add(s));
            context.SaveChanges();


        }
    }

}
