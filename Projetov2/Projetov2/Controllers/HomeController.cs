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
            List<string> animalslista = db.Animals.Select(x => x.Pagamento).ToList();
            Dashview dashboard = new Dashview();
            //
            var myRows = db.Animals
    .Where(v => v.Pagamento == "Pago").ToArray();
            var rows = myRows.Select(x => x.Pagamento).ToArray();
            //

            //var query231 = from r in db.Animals
            //            group r by r.Pagamento into g 
            //            select new { Count = g.Count(), Value = g.Key, g.Where(r=>r.Pagamento == "Pago" )};

            //int[] valuesCounted = (from r in db.Animals
            //                       group r by r.Pagamento
            //                        into g
            //                       select g.Count()).ToArray();
            //        var ids = db.Animals
            //.GroupBy(r => r.Preco);
            // The following condition examines g, the group of rows with identical FruitID:
            //.Where(g => g.Any(item => .Contains(item.BasketID))
            //         && g.Any(item => item.Pagamento == "Pago")
            //         && g.All(item => item.Pagamento != "Pendente"))
            //.Select(g => g.Key);
   

            var PagamentoPago = new[] { "Pago" };
            var ListaPagos = from order in db.Animals
                                 where PagamentoPago.Contains(order.Pagamento)
                                 select order.Preco;

            var Pago = ListaPagos.ToList();
            var PagosSum = Pago.Sum();
            float PagosCount = Pago.Count();

            var PagamentoPendente = new[] { "Pendente" };
            var ListaPendentes = from order in db.Animals
                                 where PagamentoPendente.Contains(order.Pagamento)
                                 select order.Preco;

            var Pendente = ListaPendentes.ToList();
            var PendenteSum = Pendente.Sum();
            float PendentesCount = Pendente.Count();

            var PendenteEPagoSoma = PendenteSum + PagosSum;
            var PendenteEPagoCount = PendentesCount + PagosCount;
            ViewBag.Pendente = PendenteSum;
            ViewBag.Pago = PagosSum;
            ViewBag.PendentePago = PendenteEPagoSoma;

            ViewBag.PendenteCount = PendentesCount;
            ViewBag.PagoCount = PagosCount;
            ViewBag.PendentePagoCount = PendenteEPagoCount;

            ViewBag.PorcentagemPago = ((PagosCount / PendenteEPagoCount) * 100).ToString() + "%";
            ViewBag.PorcentagemPendente = ((PendentesCount / PendenteEPagoCount) * 100).ToString()+"%";


            dashboard.clientes_count = db.Clientes.Count();
            dashboard.animais_count = db.Animals.Count();
            dashboard.funcionarios_count = db.Funcionarios.Count();
            dashboard.servicos_count = db.Servicos.Count();

            var Lucro = (from customer in db.Animals select customer).ToList();
            var querylucro = Lucro.Sum(k => k.Preco);
            var lucroround = Math.Round(Convert.ToDecimal(querylucro), 2).ToString();
            ViewBag.LucroVendas = lucroround;

            var Gastos = (from gastos in db.Funcionarios select gastos).ToList();
            var querygasto = Gastos.Sum(k => k.Salario);
            ViewBag.GastosSalario = Math.Round(Convert.ToDecimal(querygasto), 2).ToString();


            //float x = dashboard.clientes_count;
            //float y = dashboard.animais_count;
            //float resultado = (x / y);
            //var result2 = resultado.ToString("F");
            //ViewBag.animalporservico = result2;

            Animal animal = new Animal();
            List<int> contadorServico = new List<int>();
            List<string> serviconosanimais = new List<string>();
            var animales = db.Animals.Include(j => j.Servicos).ToList();
            for (int i = 1; i < dashboard.animais_count + 1; i++)
            {
                int[] contador = new int[i];
                
            }
                    foreach (var animale in animales) {
                    animal = animale;
                foreach (var servico in animale.Servicos)
                {

                    serviconosanimais.Add(servico.Nome);
                    contadorServico.Add(1);
                }               
            }
            var result = serviconosanimais
                .Zip(contadorServico, (f, q) => new { f, q })
                .GroupBy(x => x.f, x => x.q)
                .Select(x => new { serviconosanimais = x.Key, contador1 = x.Sum() })
                .ToArray();
            
            var totaleservicos = result.Select(x => x.serviconosanimais).ToArray();
            var totalquantidade = result.Select(x => x.contador1).ToArray();
            totaleservicos = totaleservicos.OrderByDescending(c => c).ToArray();
            totalquantidade = totalquantidade.OrderByDescending(c => c).ToArray();
            ViewBag.totalservicos = totaleservicos;
            ViewBag.totalquantity = totalquantidade;
            
            var listameses = new List<string>();
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
                .OrderBy(ç => ç.Year) 
                .ToArray();

            foreach (var Month in model)
            {
            listameses.Add(Month.MonthName+ "/" + Month.Year.ToString());
            }
            var totalevendas = model.Select(x => x.Vendas).ToArray(); 

            var OitoMesesAtras = listameses.Skip(Math.Max(0, listameses.Count() - 8)).ToArray();
            var vendas8meses = totalevendas.Skip(Math.Max(0, totalevendas.Count() - 8)).ToArray();

            ViewBag.Meses = OitoMesesAtras;
            ViewBag.Vendas = vendas8meses;


            //var sadas = db.Animals
            //.OrderByDescending(x => x.Entrada)
            //.GroupBy(x => new { x.Entrada.Year, x.Entrada.Month })
            //.Select(x => new SelectListItem
            //{
            // Value = string.Format("{0}|{1}", x.Key.Year, x.Key.Month),
            //    Text = string.Format("{0}/{1} (Count: {2})", x.Key.Year, x.Key.Month, x.Count())
            //})
            //.ToList();
            //var sortedMonths = meses
            // .Select(x => new { Name = x, Sort = DateTime.ParseExact(x, "MMMM", CultureInfo.CurrentCulture) })
            // .OrderBy(x => x.Sort.Month)
            // .Select(x => x.Name)
            // .ToList();
            // ViewBag.meses = sortedMonths;



            List<Animal> lst = new List<Animal>();
            var data = lst.Select(k => new { k.Entrada.Year, k.Entrada.Month, k.Preco }).GroupBy(x => new { x.Year, x.Month }, (key, group) => new
            {
                yr = key.Year,
                mnth = key.Month,
                tCharge = group.Sum(k => k.Preco)
            }).ToList();

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

        

    
