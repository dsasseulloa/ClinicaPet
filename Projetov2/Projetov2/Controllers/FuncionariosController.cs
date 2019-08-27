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

    [Authorize(Roles = "Administrador")]
    public class FuncionariosController : Controller
    {
        private ProjetoDBContext db = new ProjetoDBContext();

        public ActionResult Index(string sortOrder, string currentFilter, string searchString, int? page)
        {
            ViewBag.CurrentSort = sortOrder;
            ViewBag.NameSortParm = String.IsNullOrEmpty(sortOrder) ? "name_desc" : "";
            ViewBag.DateSortParm = sortOrder == "Date" ? "date_desc" : "Date";
            ViewBag.Date2SortParm = sortOrder == "Date2" ? "date_desc2" : "Date2";

            if (searchString != null)
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewBag.CurrentFilter = searchString;

            var funcionarios = from s in db.Funcionarios
                           select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                funcionarios = funcionarios.Where(s => s.Nome.Contains(searchString)
                                       || s.Nome.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "name_desc":
                    funcionarios = funcionarios.OrderByDescending(s => s.Nome);
                    break;
                case "Date":
                    funcionarios = funcionarios.OrderBy(s => s.DataAdmissao);
                    break;
                case "date_desc":
                    funcionarios = funcionarios.OrderByDescending(s => s.DataAdmissao);
                    break;
                default:
                    funcionarios = funcionarios.OrderBy(s => s.Nome);
                    break;
            }
            int pageSize = 10;
            int pageNumber = (page ?? 1);
            //funcionarios = db.Funcionarios.Include(f => f.Acesso);
            return View(funcionarios.ToPagedList(pageNumber, pageSize));

            // return View(clientes.ToList());
        }

        //public ActionResult Index()
        //{
        //    var funcionarios = db.Funcionarios.Include(f => f.Acesso);
        //    return View(funcionarios.ToList());
        //}

        // GET: Funcionarios/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Funcionario funcionario = db.Funcionarios.Find(id);
            if (funcionario == null)
            {
                return HttpNotFound();
            }
            return View(funcionario);
        }

        // GET: Funcionarios/Create
        public ActionResult Create()
        {
            ViewBag.FuncionarioID = new SelectList(db.Acessos, "FuncionarioID", "Usuario");
            return View();
        }

        // POST: Funcionarios/Create
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "FuncionarioID,Nome,Sexo,CPFouRG,DataNascimento,Salario,Contato,Contato2,Endereço,Bairro,Cidade,Estado,CEP,Email,Cargo,DataAdmissao")] Funcionario funcionario)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    db.Funcionarios.Add(funcionario);

                    db.SaveChanges();

                    var criadorid = funcionario.FuncionarioID;
                    var ids = criadorid;
                    return RedirectToAction("Createbyid", "Acessos", new { @id = ids });
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException exception)
                {
                    ViewBag.ErrorMessageCPF = "Este CPF já está sendo utilizado por outro cliente";
                    if (exception.InnerException.Message.Contains("CPFouRG")) // Cannot insert duplicate key row in object error
                    {
                        return View(funcionario);
                    }

                }

                return View(funcionario);
            }

            ViewBag.FuncionarioID = new SelectList(db.Acessos, "FuncionarioID", "Usuario", funcionario.FuncionarioID);
            return View(funcionario);
        }

        // GET: Funcionarios/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Funcionario funcionario = db.Funcionarios.Find(id);
            if (funcionario == null)
            {
                return HttpNotFound();
            }
            ViewBag.FuncionarioID = new SelectList(db.Acessos, "FuncionarioID", "Usuario", funcionario.FuncionarioID);
            return View(funcionario);
        }

        // POST: Funcionarios/Edit/5
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "FuncionarioID,Nome,Sexo,CPFouRG,DataNascimento,Salario,Contato,Contato2,Endereço,Bairro,Cidade,Estado,CEP,Email,Cargo,DataAdmissao")] Funcionario funcionario)
        {
            if (ModelState.IsValid)
            {
                db.Entry(funcionario).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.FuncionarioID = new SelectList(db.Acessos, "FuncionarioID", "Usuario", funcionario.FuncionarioID);
            return View(funcionario);
        }

        // GET: Funcionarios/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Funcionario funcionario = db.Funcionarios.Find(id);
            if (funcionario == null)
            {
                return HttpNotFound();
            }
            return View(funcionario);
        }

        // POST: Funcionarios/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            
            
            using (var db = new ProjetoDBContext())
            {
                
                Funcionario funcionario = db.Funcionarios.Find(id);
                db.Funcionarios.Remove(funcionario);
                Acesso acesso = db.Acessos.Find(id);
                db.Acessos.Remove(acesso);
                db.SaveChanges();
            }
        
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
