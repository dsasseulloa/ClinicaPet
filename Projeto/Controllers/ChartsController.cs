using Newtonsoft.Json;
using Projeto.DAO;
using Projeto.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Projeto.Controllers
{
    public class ChartsController : Controller
    {
        // GET: Charts
        private ProjetoDBContext db = new ProjetoDBContext();
        public ActionResult Index()
        {
            List<Servicos> listaservicos = new List<Servicos>();
            List<int> reparticoesx = new List<int>();
            var list = db.Servicos.ToList();
            var precos = db.Servicos.Select(x => x.Preco).Distinct();

            foreach (var item in precos)
            {
                reparticoesx.Add(db.Servicos.Count(x => x.Preco == item));

            }
            var rep = reparticoesx;
            ViewBag.PRECOS = precos;
            ViewBag.REP = reparticoesx.ToList();
            return View();
        }
    } }
