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

namespace Projeto.Controllers
{
    [Authorize(Roles = "Administrador, Funcionario")]
    public class ClientesController : Controller
    {
        private ProjetoDBContext db = new ProjetoDBContext();

        // GET: Clientes
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetClientes()
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
            {
                var listaClientes = db.Clientes.ToList();

                return Json(new { data = listaClientes }, JsonRequestBehavior.AllowGet);
            }
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
                var clienteData = (from tempcustomer in db.Clientes
                                    select tempcustomer);

                //Sorting    
                if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
                {
                    clienteData = clienteData.OrderBy(sortColumn + " " + sortColumnDir);
                }
                //Search    
                if (!string.IsNullOrEmpty(searchValue))
                {
                    clienteData = clienteData.Where(m => m.Nome.Contains (searchValue));
                }

                //total number of rows count     
                recordsTotal = clienteData.Count();
                //Paging     
                var data = clienteData.Skip(skip).Take(pageSize).ToList();
                //Returning Json Data    
                return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data });

            }
            catch (Exception)
            {
                throw;
            }

        }
        // GET: Clientes/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Cliente cliente = db.Clientes.Find(id);
            if (cliente == null)
            {
                return HttpNotFound();
            }
            return View(cliente);
        }
        //GET: Clientes/Create
        public ActionResult Create()
        {
            return View();
        }


        // POST: Clientes/Create
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ClienteID,Nome,Sexo,DataNascimento,CPFouRG,Contato,Contato2,Endereço,Bairro,Cidade,Estado,CEP,Email,DataCadastro")] Cliente cliente)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    db.Clientes.Add(cliente);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException exception)
                {
                    
                    if (exception.InnerException.Message.Contains("CPFouRG")) // Cannot insert duplicate key row in object error
                    {
                        ViewBag.ErrorMessageCPF = "Este CPF já está sendo utilizado por outro cliente";
                        return View(cliente);
                    }

                }


            }
            return View(cliente);
        }



        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Cliente cliente = db.Clientes.Find(id);
            if (cliente == null)
            {
                return HttpNotFound();
            }
            return View(cliente);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ClienteID,Nome,Sexo,DataNascimento,CPFouRG,Contato,Contato2,Endereço,Bairro,Cidade,Estado,CEP,Email,DataCadastro")] Cliente cliente)
        {
            if (ModelState.IsValid)
            {
                db.Entry(cliente).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(cliente);
        }
        // GET: Clientes/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Cliente cliente = db.Clientes.Find(id);
            if (cliente == null)
            {
                return HttpNotFound();
            }
            return View(cliente);
        }
        [HttpPost]
        public JsonResult DeleteCustomer(int? ID)
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
            {

                var cliente = db.Clientes.Find(ID);
             
                if (ID == null)
                    return Json(data: "Not Deleted", behavior: JsonRequestBehavior.AllowGet);
                db.Clientes.Remove(cliente);
                db.SaveChanges();

                return Json(data: "Deleted", behavior: JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Clientes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Cliente cliente = db.Clientes.Find(id);
            db.Clientes.Remove(cliente);
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
