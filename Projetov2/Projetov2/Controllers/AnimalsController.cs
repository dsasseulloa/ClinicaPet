using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Projeto.DAO;
using Projeto.Models;
using Projeto.Models.ViewModel;

namespace Projeto.Controllers
{
    //[Authorize(Roles = "Administrador, Funcionario")]
    public class AnimalsController : Controller
    {
        private ProjetoDBContext db = new ProjetoDBContext();

        // GET: Animals
        public ActionResult Index()
        {
            var animals = db.Animals.Include(a => a.Clientes).Include(a => a.Servicos);
            return View(animals.ToList());
        }

        // GET: Animals/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Animal animal = db.Animals.Find(id);
            if (animal == null)
            {
                return HttpNotFound();
            }
            return View(animal);
        }

        // GET: Animals/Create
        public ActionResult Create()
        {


            var animal = new Animal();
            animal.Servicos = new List<Servicos>();

            ViewBag.ClienteID = new SelectList(db.Clientes, "ClienteID", "Nome");
            PopulateAssignedCourseData(animal);
            return View();
        }

        // POST: Animals/Create
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "AnimalID,Nome,Sexo,Raca,Motivo,Observaçoes,Sangue,Nascimento,Idade,Entrada,Saida,DataCadastro,ClienteID,Preco,Pagamento")] Animal animal, string[] selectedServicos)
        {
            if (selectedServicos != null)
            {
                animal.Servicos = new List<Servicos>();
                foreach (var servico in selectedServicos)
                {
                    var servicoToAdd = db.Servicos.Find(int.Parse(servico));
                    animal.Servicos.Add(servicoToAdd);

                }
            }
            if (ModelState.IsValid)
            {

                db.Animals.Add(animal);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.ClienteID = new SelectList(db.Clientes, "ClienteID", "Nome", animal.ClienteID);
            PopulateAssignedCourseData(animal);
            return View(animal);
        }

        // GET: Animals/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            //Animal animal = db.Animals.Find(id);

            Animal animal = db.Animals

        .Include(i => i.Servicos)
        .Where(i => i.AnimalID == id)
        .Single();
            PopulateAssignedCourseData(animal);
            if (animal == null)
            {
                return HttpNotFound();
            }
            ViewBag.ClienteID = new SelectList(db.Clientes, "ClienteID", "Nome", animal.ClienteID);

            return View(animal);
        }

        // POST: Animals/Edit/5
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "AnimalID,Nome,Sexo,Raca,Motivo,Observaçoes,Sangue,Nascimento,Idade,Entrada,Saida,DataCadastro,ClienteID,Preco,Pagamento")] Animal animal, int? id, string[] selectedServicos)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var AnimalAtualizar = db.Animals

   .Include(i => i.Servicos)
   .Where(i => i.AnimalID == id)
   .Single();
            if (TryUpdateModel(AnimalAtualizar, "",
       new string[] { "AnimalID,Nome,Sexo,Raca,Motivo,Observaçoes,Sangue,Nascimento,Idade,Entrada,Saida,DataCadastro,ClienteID,Preco,Pagamento" }))
            {
                try
                {

                    UpdateAnimaleServicos(selectedServicos, AnimalAtualizar);

                    db.SaveChanges();

                    return RedirectToAction("Index");
                }
                catch (RetryLimitExceededException /* dex */)
                {
                    //Log the error (uncomment dex variable name and add a line here to write a log.
                    ModelState.AddModelError("", "Problema para Salvar");
                }
            }
            PopulateAssignedCourseData(AnimalAtualizar);
            return View(AnimalAtualizar);
        }
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Animal animal = db.Animals.Find(id);
            if (animal == null)
            {
                return HttpNotFound();
            }
            return View(animal);
        }
        // POST: Animals/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Animal animal = db.Animals

     .Where(i => i.AnimalID == id)
     .Single();

            db.Animals.Remove(animal);


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


        private void PopulateAssignedCourseData(Animal animal)
        {
            var allServicos = db.Servicos;
            var ServicosAnimal = new HashSet<int>(animal.Servicos.Select(c => c.ServicoID));
            var viewModel = new List<ServicoAssignedData>();
            foreach (var servico in allServicos)
            {
                viewModel.Add(new ServicoAssignedData
                {
                    ServicoID = servico.ServicoID,
                    Nome = servico.Nome,
                    Assigned = ServicosAnimal.Contains(servico.ServicoID)
                });
            }
            ViewBag.Servicos = viewModel;
        }

        private void UpdateAnimaleServicos(string[] selectedServicos, Animal AnimalAtualizar)
        {
            if (selectedServicos == null)
            {
                AnimalAtualizar.Servicos = new List<Servicos>();
                return;
            }

            var selectedServicosHS = new HashSet<string>(selectedServicos);
            var AnimaleServicos = new HashSet<int>
                (AnimalAtualizar.Servicos.Select(c => c.ServicoID));
            foreach (var servico in db.Servicos)
            {
                if (selectedServicos.Contains(servico.ServicoID.ToString()))
                {
                    if (!AnimaleServicos.Contains(servico.ServicoID))
                    {
                        AnimalAtualizar.Servicos.Add(servico);
                    }
                }
                else
                {
                    if (AnimaleServicos.Contains(servico.ServicoID))
                    {
                        AnimalAtualizar.Servicos.Remove(servico);
                    }
                }
            }
        }

    }
}