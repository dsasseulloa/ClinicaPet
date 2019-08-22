using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Projeto.DAO;
using Projeto.Models;

namespace Projeto.Controllers
{
    [Authorize(Roles = "Administrador")]
    public class AcessosController : Controller
    {
        private ProjetoDBContext db = new ProjetoDBContext();



        public ActionResult Index()
        {
            var acessos = db.Acessos.Include(a => a.Funcionario);
            return View(acessos.ToList());
        }

        // GET: Acessos/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Acesso acesso = db.Acessos.Find(id);
            if (acesso == null)
            {
                return HttpNotFound();
            }
            return View(acesso);
        }

        // GET: Acessos/Create
        public ActionResult Create()
        {
            ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome");
            return View();
        }

        // POST: Acessos/Create
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "FuncionarioID,Username,Senha,Ativo,Perfil")] Acesso acesso)
        {
            if (ModelState.IsValid)
            {
                db.Acessos.Add(acesso);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome", acesso.FuncionarioID);
            return View(acesso);
        }
        public ActionResult Createbyid(int? id)
        {
            if (id == null)
            {
                
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Acesso acesso = db.Acessos.Find(id);
            if (acesso == null)
            {
                Funcionario funcionario = db.Funcionarios.Find(id);
                var funf = funcionario.Nome;
                ViewBag.funcioNome = funf;
                return View(acesso);
            }
            return View(acesso);
           
            //Funcionario funcionario = db.Funcionarios.Find(id);
            //Acesso acesso = db.Acessos.Find(id);
            //ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome");
            //return View(acesso);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Createbyid( int id, Acesso acesso, Funcionario funcionario)
        {
            if (ModelState.IsValid)
            {

                acesso.FuncionarioID = id;
                
                db.Acessos.Add(acesso);
                db.SaveChanges();
                return RedirectToAction("Index", "Funcionarios");
            }
            ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome", acesso.FuncionarioID);
            return View(acesso); // model here is the class which is passed to the Create method
        }

        // GET: Acessos/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Acesso acesso = db.Acessos.Find(id);
            if (acesso == null)
            {
                return HttpNotFound();
            }
            ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome", acesso.FuncionarioID);
            return View(acesso);
        }

        // POST: Acessos/Edit/5
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "FuncionarioID,Usuario,Senha,Ativo,Perfil")] Acesso acesso, int? id)
        {

            if (ModelState.IsValid)
            {
                db.Entry(acesso).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException exception)
                {
                    ViewBag.ErrorMessage = "kewk";
                    if (exception.InnerException.Message.Contains("Usuario")) // Cannot insert duplicate key row in object error
                    {

                        // handle duplicate key error
                        return RedirectToAction("Edit", "Acessos", new { @id = id });
                    }

                }
               
                
            }
            ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome", acesso.FuncionarioID);
            return View(acesso);
        }

        // GET: Acessos/Delete/5


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        public ActionResult EditAcesso(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Acesso acesso = db.Acessos.Find(id);
            if (acesso == null)
            {
                return RedirectToAction("Createbyid", "Acessos", new { @id = id });
            }
            Funcionario funcionario = db.Funcionarios.Find(id);
            var funf = funcionario.Nome;
            ViewBag.funcioNome = funf;
            ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome", acesso.FuncionarioID);
            return View(acesso);
            // return RedirectToAction("CreateAcesso", "Funcionarios");
            // return View("Acesso/Edit", new {Acessos = ViewBag.FuncionarioID });

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditAcesso([Bind(Include = "FuncionarioID,Usuario,Senha,Ativo,Perfil")] Acesso acesso,int? id)
        {
            if (ModelState.IsValid)
            {
                db.Entry(acesso).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                    return RedirectToAction("Index","Acessos");
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException exception)
                {
                    Funcionario funcionario = db.Funcionarios.Find(id);
                    var funf = funcionario.Nome;
                    ViewBag.funcioNome = funf;
                    ViewBag.ErrorMessage = "kewk";
                    if (exception.InnerException.Message.Contains("Usuario")) // Cannot insert duplicate key row in object error
                    {

                        // handle duplicate key error
                        return RedirectToAction("EditAcesso", "Acessos", new { @id = id });

                    }

                }
            }
            ViewBag.FuncionarioID = new SelectList(db.Funcionarios, "FuncionarioID", "Nome", acesso.FuncionarioID);
            return View(acesso);
        }


    }
}
