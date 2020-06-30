using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PagedList;
using Projeto.DAO;
using Projeto.Models;

namespace Projeto.Controllers
{
    [Authorize(Roles = "Administrador, Funcionario")]
    public class ServicosController : Controller
    {
        private ProjetoDBContext db = new ProjetoDBContext();

        // GET: Servicos
        public ActionResult Index(string sortOrder, string currentFilter, string searchString, int? page)
        {
            ViewBag.CurrentSort = sortOrder;
            ViewBag.NameSortParm = String.IsNullOrEmpty(sortOrder) ? "name_desc" : "";
            //ViewBag.DateSortParm = sortOrder == "Date" ? "date_desc" : "Date";
            //ViewBag.Date2SortParm = sortOrder == "Date2" ? "date_desc2" : "Date2";
            Animal a = new Animal();
            
            if (searchString != null)
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewBag.CurrentFilter = searchString;

            var servicos = from s in db.Servicos
                               select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                servicos = servicos.Where(s => s.Nome.Contains(searchString)
                                       || s.Nome.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "name_desc":
                    servicos = servicos.OrderByDescending(s => s.Nome);
                    break;
                //case "Date":
                //    servicos = servicos.OrderBy(s => s.DataAdmissao);
                //    break;
                //case "date_desc":
                //    servicos = servicos.OrderByDescending(s => s.DataAdmissao);
                //    break;
                default:
                    servicos = servicos.OrderBy(s => s.Nome);
                    break;
            }
            int pageSize = 10;
            int pageNumber = (page ?? 1);
            //funcionarios = db.Funcionarios.Include(f => f.Acesso);
            return View(servicos.ToPagedList(pageNumber, pageSize));

            // return View(clientes.ToList());
        }

        // GET: Servicos/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Servicos servicos = db.Servicos.Find(id);
            if (servicos == null)
            {
                return HttpNotFound();
            }
            return View(servicos);
        }

        // GET: Servicos/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Servicos/Create
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ServicoID,Nome,Preco,Descricao")] Servicos servicos)
        {
            if (ModelState.IsValid)
            {
                db.Servicos.Add(servicos);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(servicos);
        }

        // GET: Servicos/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Servicos servicos = db.Servicos.Find(id);
            if (servicos == null)
            {
                return HttpNotFound();
            }
            return View(servicos);
        }

        // POST: Servicos/Edit/5
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ServicoID,Nome,Preco,Descricao")] Servicos servicos)
        {
            if (ModelState.IsValid)
            {
                db.Entry(servicos).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(servicos);
        }

        // GET: Servicos/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Servicos servicos = db.Servicos.Find(id);
            if (servicos == null)
            {
                return HttpNotFound();
            }
            return View(servicos);
        }

        // POST: Servicos/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Servicos servicos = db.Servicos.Find(id);
            db.Servicos.Remove(servicos);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
