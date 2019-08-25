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

namespace Projeto.Controllers
{
    [Authorize(Roles = "Administrador, Funcionario")]
    public class HomeController : Controller
    {
        
        private ProjetoDBContext db = new ProjetoDBContext();

        [Authorize(Roles = "Administrador, Funcionario")]
        public ActionResult Index(Funcionario login, string returnUrl)
        {
            
            Dashview dashboard = new Dashview();

            dashboard.clientes_count = db.Clientes.Count();
            dashboard.animais_count = db.Animals.Count();
            dashboard.funcionarios_count = db.Funcionarios.Count();
            dashboard.servicos_count = db.Servicos.Count();

            float x = dashboard.clientes_count;
            float y = dashboard.animais_count;
            float resultado = (x / y);
            var result2 = resultado.ToString("F");
          ViewBag.animalporservico = result2;




            object sessao = Session["FuncionarioLogado"];
            if (sessao != null)
            {
                return View(dashboard);
            }
            return RedirectToAction("Login", "Account");
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

        public ActionResult Dashboard()
        {
            List<Servicos> listaservicos = new List<Servicos>();
            List<int> reparticoes = new List<int>();
            var list = db.Servicos.ToList();
            var precos = list.Select(x => x.Preco).Distinct();

           foreach (var item in precos)
            {
               reparticoes.Add(list.Count(x => x.Preco == item));

            }
            var rep = reparticoes;
            ViewBag.PRECOS = precos;
            ViewBag.REP = reparticoes.ToList();
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

        

    
