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
using System.Globalization;

namespace Projeto.Controllers
{
    [Authorize(Roles = "Administrador, Funcionario")]
    public class HomeController : Controller
    {

        private ProjetoDBContext db = new ProjetoDBContext();

        [Authorize(Roles = "Administrador, Funcionario")]
        public ActionResult Index(Funcionario login, string returnUrl)
        {
            var animals = db.Animals.Include(ab => ab.Clientes).Include(ab => ab.Servicos);

            Dashview dashboard = new Dashview();

            dashboard.clientes_count = db.Clientes.Count();
            dashboard.animais_count = db.Animals.Count();
            dashboard.funcionarios_count = db.Funcionarios.Count();
            dashboard.servicos_count = db.Servicos.Count();

            var Lucro = (from customer in db.Animals select customer).ToList();
            var querylucro = Lucro.Sum(k => k.Preco);
            var lucroround = Math.Round(Convert.ToDecimal(querylucro), 2).ToString();
            ViewBag.Precos = lucroround;

            var Gastos = (from gastos in db.Funcionarios select gastos).ToList();
            var querygasto = Gastos.Sum(k => k.Salario);
            ViewBag.Gastos = Math.Round(Convert.ToDecimal(querygasto), 2).ToString();

            
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
                .OrderByDescending(ç => ç.Year)
                .ThenByDescending(ç => ç.Month)
                .ToArray();

            ViewBag.testeteste = model;

            var mesesorder = model.OrderBy(x=>x.Month).ToArray();
            
            var totalevendas = model.Select(x => x.Vendas).ToArray(); 

            var meses = model.Select(x => x.MonthName).ToArray();
           
            var meses10 = model.Select(g => new ArchiveEntry
            {
                Month = g.Month,
                Year = g.Year
            }).ToArray();
            ViewBag.meses10 = meses10;




            var modelmeses = context.Animals
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

    })
    .OrderByDescending(ç => ç.Year)
    .ThenByDescending(ç => ç.Month)
    .ToArray();

            ViewBag.modelmeses = modelmeses;

           //var sortedMonths = meses
           // .Select(x => new { Name = x, Sort = DateTime.ParseExact(x, "MMMM", CultureInfo.CurrentCulture) })
           // .OrderBy(x => x.Sort.Month)
           // .Select(x => x.Name)
           // .ToList();
           // ViewBag.meses = sortedMonths;

            var sortedMonths = meses
 .Select(x => new { Name = x, Sort = DateTime.ParseExact(x, "MMMM", CultureInfo.CurrentCulture) })
 .OrderBy(x => x.Sort.Month)
 .Select(x => x.Name)
 .ToList();
            ViewBag.meses = sortedMonths;

            //var grouped = from p in db.Animals
            //  group p by new { month = p.Entrada.Month, year = p.Entrada.Year } into d
            //  select new { dt = string.Format("{0}/{1}", d.Key.month, d.Key.year), count = d.Count() };


            //            var sadas = db.Animals
            //// This will return the list with the most recent date first.
            //.OrderByDescending(x => x.Entrada)
            //.GroupBy(x => new { x.Entrada.Year, x.Entrada.Month })
            //// Bonus: You can use this on a drop down
            //.Select(x => new SelectListItem
            //{
            //    Value = string.Format("{0}|{1}", x.Key.Year, x.Key.Month),
            //    Text = string.Format("{0}/{1} (Count: {2})", x.Key.Year, x.Key.Month, x.Count())
            //})
            //.ToList();

            List<Animal> lst = new List<Animal>();
            var data = lst.Select(k => new { k.Entrada.Year, k.Entrada.Month, k.Preco }).GroupBy(x => new { x.Year, x.Month }, (key, group) => new
            {
                yr = key.Year,
                mnth = key.Month,
                tCharge = group.Sum(k => k.Preco)
            }).ToList();

           // var meses1 = model.Select(x => x.Month).ToList();
           // var query1 = mesesorder.Select(d => d != null ? d.ToString("MMMM") : "Null");
           ///var mesesnome = model.Select(x => x.Month x.ToString("MMMM"));
           // var a = query.TGetAbbreviatedMonthName();
           // ViewBag.mesesnome = query1.ToList();
            



            ViewBag.ano = DateTime.Now.Year;
            ViewBag.totalevendas = totalevendas;
            
            //var meseslast = sortedMonths.Last();
            var vendaslast = totalevendas.Last();
            ViewBag.VendasLast = vendaslast; //ultima venda do mês

            var querieslucro = (vendaslast - querygasto);
            var querieslucroround = Math.Round(Convert.ToDecimal(querieslucro), 2).ToString();
            ViewBag.Lucro = querieslucroround;

            //calculo percentual dos dois ultimos meses
            var penultimaVendaMes = totalevendas.Skip(totalevendas.Count() - 2).Take(1).Single();
            var percentual = ((vendaslast - penultimaVendaMes)/(penultimaVendaMes)) * 100;
            ViewBag.percentualVenda = Math.Round(Convert.ToDecimal(percentual), 2);
           
            object sessao = Session["FuncionarioLogado"];
            if (sessao != null)
            {
                return View(dashboard);
            }
            return RedirectToAction("Login", "Account");
        }



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

        

    
