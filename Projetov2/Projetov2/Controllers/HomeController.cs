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

            object sessao = Session["FuncionarioLogado"];
            if (sessao != null)
            {
                return View(dashboard);
            }
            return RedirectToAction("Login", "Account");
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

        

    
