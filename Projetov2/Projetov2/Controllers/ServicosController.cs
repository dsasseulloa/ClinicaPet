using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq.Dynamic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PagedList;
using Projeto.DAO;
using Projeto.Models;
using DataTables;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.DataVisualization.Charting;
using Projeto.Models.ViewModel;
using System.Globalization;

namespace Projeto.Controllers
{
    [Authorize(Roles = "Administrador, Funcionario")]
    public class ServicosController : Controller
    {
        private ProjetoDBContext db = new ProjetoDBContext();

        [Authorize(Roles = "Administrador, Funcionario")]
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public ActionResult GetServicos()
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
            {
                var listaServicos = db.Servicos.ToList();

                return Json(new { data = listaServicos }, JsonRequestBehavior.AllowGet);
            }
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
        public ActionResult LoadData()
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
                try
                {
                    var draw = Request.Form.GetValues("draw").FirstOrDefault();
                    var start = Request.Form.GetValues("start").FirstOrDefault();
                    var length = Request.Form.GetValues("length").FirstOrDefault();
                    var sortColumn = Request.Form.GetValues("columns[" + Request.Form.GetValues("order[0][column]").FirstOrDefault() + "][name]").FirstOrDefault();
                    var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
                    var searchValue = Request.Form.GetValues("search[value]").FirstOrDefault();


                    //Paging Size (10,20,50,100)    
                    int pageSize = length != null ? Convert.ToInt32(length) : 0;
                    int skip = start != null ? Convert.ToInt32(start) : 0;
                    int recordsTotal = 0;

                    // Getting all Customer data    
                    var servicoData = (from tempcustomer in db.Servicos
                                       select tempcustomer);

                    //Sorting    
                    if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
                    {
                        servicoData = servicoData.OrderBy(sortColumn + " " + sortColumnDir);
                    }
                    //Search    
                    if (!string.IsNullOrEmpty(searchValue))
                    {
                        servicoData = servicoData.Where(m => m.Nome.Contains(searchValue));
                    }

                    //total number of rows count     
                    recordsTotal = servicoData.Count();
                    //Paging     
                    var data = servicoData.Skip(skip).Take(pageSize).ToList();
                    //Returning Json Data    
                    return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data });

                }
                catch (Exception)
                {
                    throw;
                }

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
        [HttpPost]
        public JsonResult DeleteCustomer(int? ID)
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
            {

                var servicos = db.Servicos.Find(ID);

                if (ID == null)
                    return Json(data: "Não deletado", behavior: JsonRequestBehavior.AllowGet);
                db.Servicos.Remove(servicos);
                db.SaveChanges();

                return Json(data: "Deletado", behavior: JsonRequestBehavior.AllowGet);
            }
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
