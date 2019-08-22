using Projeto.Models;
using Projeto.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Projeto.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        
        private ProjetoDBContext db = new ProjetoDBContext();
        

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

    }
}