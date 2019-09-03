using Projeto.Models;
using Projeto.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using System.Net;
using Newtonsoft.Json;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.DataVisualization.Charting;
using Projeto.Models.ViewModel;


namespace Projeto.Controllers
{
    [Authorize(Roles = "Administrador, Funcionario")]
    public class HomeController : Controller
    {

        private ProjetoDBContext db = new ProjetoDBContext();

        [Authorize(Roles = "Administrador, Funcionario")]
        public ActionResult Index(Funcionario login, string returnUrl)
        {
            var animals = db.Animals.Include(a => a.Clientes).Include(a => a.Servicos);

            Dashview dashboard = new Dashview();

            dashboard.clientes_count = db.Clientes.Count();
            dashboard.animais_count = db.Animals.Count();
            dashboard.funcionarios_count = db.Funcionarios.Count();
            dashboard.servicos_count = db.Servicos.Count();

            var Lucro = (from customer in db.Animals select customer).ToList();
            var query = Lucro.Sum(k => k.Preco);
            ViewBag.Precos = Math.Round(Convert.ToDecimal(query), 2).ToString();
            //float x = dashboard.clientes_count;
            //float y = dashboard.animais_count;
            //float resultado = (x / y);
            //var result2 = resultado.ToString("F");
            //ViewBag.animalporservico = result2;

            var allServicos = db.Servicos;
            List<string> listastrings = new List<string>();
            var AnimaisCadastrados = dashboard.animais_count;
            Animal animal = new Animal();
            var animales = db.Animals.Include(j => j.Servicos).ToList();
            List<int> contador1 = new List<int>();
            List<string> serviconosanimais = new List<string>();
            List<string> lsitanimal = new List<string>();
            //
            //
            for (int i = 1; i < AnimaisCadastrados + 1; i++)
            {
                int[] contador = new int[i];
                
            }

                    foreach (var animale in animales) {
                    animal = animale;

                //lsitanimal.Add(animale.Nome);
                //var lista1 = db.Animals.GroupBy(r => new { r.AnimalID, r.Entrada });

                //var aasda = lista1.Select(group => new Animal
                //{
                //    AnimalID = group.Key.AnimalID,

                //    Entrada = group.Key.Entrada,
                //    Preco = group.Sum(s => s.Preco)

                //}).GroupBy(r => new { r.AnimalID, r.Entrada });
                //ViewBag.aslda = aasda.ToArray();
                foreach (var servico in animale.Servicos)
                {

                    serviconosanimais.Add(servico.Nome);
                    contador1.Add(1);
                }
                ViewBag.teste1 = serviconosanimais;
                ViewBag.Teste2 = contador1;
                ViewBag.Teste2 = contador1.Count();
               
            }
            var result = serviconosanimais
                .Zip(contador1, (f, q) => new { f, q })
                .GroupBy(x => x.f, x => x.q)
                .Select(x => new { serviconosanimais = x.Key, contador1 = x.Sum() })
                .ToArray();

            var totalefruit = result.Select(x => x.serviconosanimais).ToArray();
            var totalquantity = result.Select(x => x.contador1).ToArray();

            totalefruit = totalefruit.OrderByDescending(c => c).ToArray();
            totalquantity = totalquantity.OrderByDescending(c => c).ToArray();

            ViewBag.totalservicos = totalefruit;
            ViewBag.totalquantity = totalquantity;
            //
            var context = new ProjetoDBContext();
            var model = context.Animals
                .GroupBy(o => new
                {
                    Month = o.Entrada.Month,
                    Year = o.Entrada.Year,

                })
                .Select(g => new ArchiveEntry
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Total = g.Count(),
                    Vendas = g.Sum(s => s.Preco)

                })
                .OrderByDescending(a => a.Year)
                .ThenByDescending(a => a.Month)
                .ToArray();

            ViewBag.testeteste = model;

            var totalevendas = model.Select(x => x.Vendas).ToArray();
            var meses = model.Select(x => x.Month).OrderBy(x=>x);

            var resultss = from mesess in model.ToList()
                         select new
                         {
                             Month = mesess.Month.ToString("MMMM")      
                         };

            var resultsx = resultss.ToArray();

            ViewBag.totalevendas = totalevendas;
            ViewBag.meses = meses.ToArray(); //trocar tolist e tostring
            //
            //Getmonth();
            object sessao = Session["FuncionarioLogado"];
            if (sessao != null)
            {
                return View(dashboard);
            }
            return RedirectToAction("Login", "Account");
        }

        public ActionResult Indexteste()
        {
            var context = new ProjetoDBContext();
            var model = context.Animals
                .GroupBy(o => new
                {
                    Month = o.Entrada.Month,
                    Year = o.Entrada.Year,
                    
                })
                .Select(g => new ArchiveEntry
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Total = g.Count(),
                    Vendas = g.Sum(s=>s.Preco)
                    
                })
                .OrderByDescending(a => a.Year)
                .ThenByDescending(a => a.Month)      
                .ToArray();

            ViewBag.testeteste = model;

            var totalevendas = model.Select(x => x.Vendas).ToArray();
            var meses = model.Select(x => x.MonthName).ToArray();



            return View(model);
        }
        //public ActionResult Getmonth()
        //{
        //    List<int> contador1 = new List<int>();
        //    List<string> serviconosanimais = new List<string>();
        //    List<DateTime> dates = new List<DateTime>();
        //    var animales = db.Animals;
        //    Animal animal = new Animal();
        //    using (var context = new ProjetoDBContext())
        //    {
        //        foreach (var animale in animales)
        //        {
        //            animal = animale;

        //        var query = from x in db.Animals
        //        where x.Entrada > DateTime.Now.AddMonths(-12)
        //        orderby x.Entrada descending
        //        select x;

        //            dates.Add(query);
        //        }

        //    }


        //    return View();
        //}

        public ActionResult encontrarservicos()
        {
            Dashview dashboard = new Dashview();
            ViewBag.Animais = dashboard.animais_count;
            dashboard.animais_count = db.Animals.Count();
            var AnimaisCadastrados = dashboard.animais_count;
            var animallist = db.Animals.ToList();
            ViewBag.Listaanimais = AnimaisCadastrados;
            Animal animal = new Animal();
            var listahash = new HashSet<int>();


            dashboard.funcionarios_count = db.Funcionarios.Count();
            dashboard.servicos_count = db.Servicos.Count();
            
            var allServicos = db.Servicos;
            List<string> listastrings = new List<string>();
          
            List<int> contador1 = new List<int>();
            List<string> serviconosanimais = new List<string>();
            for (int i = 1; i < AnimaisCadastrados + 1; i++)
            {
                int[] contador = new int[i];
                
                animal = db.Animals
               .Include(j => j.Servicos)
               .Where(j => j.AnimalID == i)
               .Single();

                foreach(var servico in animal.Servicos)
                {
                    serviconosanimais.Add(servico.Nome);
                    contador1.Add(1);
                }
                //ViewBag.teste1 = serviconosanimais;
                //ViewBag.Teste2 = contador1;
                //ViewBag.Teste2 = contador1.Count();
                //GetAnimalForServicos(contador);
            }
            var result = serviconosanimais
                .Zip(contador1, (f, q) => new { f, q })
                .GroupBy(x => x.f, x => x.q)
                .Select(x => new { serviconosanimais = x.Key, contador1 = x.Sum() })
                .ToArray();

            var totalefruit = result.Select(x => x.serviconosanimais).ToArray();
            var totalquantity = result.Select(x => x.contador1).ToArray();

            totalefruit = totalefruit.OrderByDescending(c => c).ToArray();
            totalquantity = totalquantity.OrderByDescending(c => c).ToArray();

            ViewBag.totalservicos = totalefruit;
            ViewBag.totalquantity = totalquantity;

            return View();
            }
        


        public IQueryable<Servicos> GetAnimalForServicos(int[] animalid)
        {

            List<string> listastrings = new List<string>();
            var employees = db.Animals
                                     .Where(r => animalid.Contains(r.AnimalID))
                                     .SelectMany(x => x.Servicos)
                                     .Distinct();

            return employees;
        }


        public ActionResult Novochart()
        {
            BarChartViewModel model = new BarChartViewModel();

            // Here you can your db.Student to populate it
            var source = new Cliente();
            var a = db.Clientes.ToList();
            
            

            //for (int i = 1; i < 7; i++)
            //{
            //    int dataItemMale = a.Where(s => s.Sexo == "Masculino" && s.Dob.Month == i).Count();
            //    model.Male.Add(dataItemMale);

            //    int dataItemFemale = a.Where(s => s.Sexo == "Feminino" && s.Dob.Month == i).Count();
            //    model.Female.Add(dataItemFemale);
            //}
            return View(model);


        }
        public ActionResult Dashboard()
        {
            var viewmodel = new Animal();
            foreach (var item in db.Animals)
            {
                int id = item.AnimalID;

                //SystemsCount 
                int counting = db.Servicos.Where(x => x.ServicoID == id).Count();
                item.Contagem = counting;
            }
            ViewBag.Count = db.Animals.Count();
            int count1 = db.Servicos.Count();
            ViewBag.SCount = count1;

            //var animals = viewmodel.Servicos.Where(e => e.ServicoID.Any(t => animals.Contains(t.AnimalID)));
            //var alistaa = (from e in viewmodel.AnimalID from t in e.Tags where tagsIDList.Contains(t.TagID) select e);


            return View(db.Animals.ToList());
        }
        //public IQueryable<Animal> GetEmployeesForRoles2(int[] roleIds)
        //{
        //    var employees = db.Servicos
        //                             .Where(r => roleIds.Contains(r.ServicoID))
        //                             .SelectMany(x => x.Animals)
        //                             .Distinct();
        //    return employees;
        //}
        //public IQueryable<Animal> GetEmployeesForRoles(int[] roleIds)
        //{
          
        //    var employees = db.Animals.Where(x => x.Servicos.Any(r => roleIds.Contains(r.ServicoID)));
        //    var alistt = employees.ToList();
        //    List<Servicos> systems;
        //    var query = db.Animals.Select(c => c.Servicos).ToList();
        //    foreach (var sid in query)
        //    {
        //        systems = alistt;
        //    }
        //    int count = systems.Count();//Here you will  get count

        //    ViewBag.Counts = count;
        //    return View();
        //}


    


        public ActionResult GetData()
        {
            Servicos servicos = new Servicos();
            var data = new[] { new Servicos() { ServicoID = 1, Nome = servicos.Nome }, new Servicos() { ServicoID = 2, Nome = servicos.Nome } };

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ContentResult GetData2()
        {
            List<Servicos> dashboardg1 = new List<Servicos>();
            var resultados = db.Servicos.ToList();
            foreach(Servicos Servicos in resultados)
            {
                Servicos dashboardg1vm = new Servicos();
                dashboardg1vm.Nome = Servicos.Nome;
                dashboardg1vm.Preco = Servicos.Preco;
               
            }
            return Content(JsonConvert.SerializeObject(dashboardg1), "application/json");
        }

        public ActionResult Dashboarda()
        {
            Dashview dashboard = new Dashview();

            dashboard.clientes_count = db.Clientes.Count();
            dashboard.animais_count = db.Animals.Count();
            dashboard.funcionarios_count = db.Funcionarios.Count();
            dashboard.servicos_count = db.Servicos.Count();

            List<Servicos> listaservicos = new List<Servicos>();
            List<int> reparticoes = new List<int>();
            var list = db.Servicos.ToList();
            var precos = list.Select(x => x.Preco).Distinct();

           foreach (var item in precos)
            {
               reparticoes.Add(list.Count(x => x.Preco == item));

            }
            var rep = reparticoes;
            ViewBag.PRECOS = dashboard.servicos_count;
            ViewBag.REP = reparticoes.ToList();

            Animal animal = new Animal();
            var allServicos = db.Servicos;
            var ServicosAnimal = new HashSet<int>(animal.Servicos.Select(c => c.ServicoID));
            var viewModel = new List<ServicoAssignedData>();
            foreach (var servico in allServicos)
            {
                viewModel.Add(new ServicoAssignedData
                {
                    ServicoID = servico.ServicoID,

                });
            }
            ViewBag.Servicos = viewModel;

            return View();
        }


        public ActionResult DataFromDataBase()
        {
            try
            {
                ViewBag.DataPoints = JsonConvert.SerializeObject(db.Servicos.ToList(), _jsonSetting);

                return View();
            }
            catch (System.Data.Entity.Core.EntityException)
            {
                return View("Error");
            }
            catch (System.Data.SqlClient.SqlException)
            {
                return View("Error");
            }
        }
        JsonSerializerSettings _jsonSetting = new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore };
    }


}	

        

    
