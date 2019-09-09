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
using System.Data.Entity.Infrastructure;
using Projeto.Models.ViewModel;

namespace Projeto.Controllers
{

    [Authorize(Roles = "Administrador, Funcionario")]
    public class AnimalsController : Controller
    {
        private ProjetoDBContext db = new ProjetoDBContext();

        // GET: Animal
        [HttpGet]
        public ActionResult Index()
        {
            var animals = db.Animals.Include(a => a.Clientes).Include(a => a.Servicos);
            return View(animals.ToList());
        }
        [HttpGet]
        public ActionResult GetAnimals()
        {
            
            using (ProjetoDBContext db = new ProjetoDBContext())
            {
                Animal animal = new Animal();
               
                var listaAnimais = db.Animals.ToList();

                return Json(new { data = listaAnimais }, JsonRequestBehavior.AllowGet);
            }
        }
        
        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        [ValidateInput(false)]
        public ActionResult Table()
        {
            var settings = Properties.Settings.Default;
            var formData = HttpContext.Request.Form;
            //db.Configuration.LazyLoadingEnabled = false;
            using (var db = new DataTables.Database(settings.DbType, settings.DbConnection))
            {

                var response = new Editor(db, "Animal", pkey: "AnimalID")
                    //.Model<Animal>()
                    .Field(new Field("Nome"))
                    .Field(new Field("ClienteNome"))
                    .Field(new Field("Tipo"))
                    .Field(new Field("Sexo"))
                    .Field(new Field("Preco"))
                    .Field(new Field("Idade"))
                    .Field(new Field("Pagamento"))
                    .Field(new Field("Entrada")
                    
                        .Validator(Validation.DateFormat(
                            Format.DATE_ISO_8601,
                            new ValidationOpts { Message = "Please enter a date in the format yyyy-mm-dd" }
                        ))
                    )
                    .Process(formData)
                    .Data();

                return Json(response, JsonRequestBehavior.AllowGet);
            }
        }
    
                public ActionResult loaddata2()
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
            {
                // dc.Configuration.LazyLoadingEnabled = false; // if your table is relational, contain foreign key
                var data = db.Animals.OrderBy(a => a.Nome).ToList();
                return Json(new { data = data }, JsonRequestBehavior.AllowGet);
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
                    var animalData = (from tempcustomer in db.Animals
                                      select tempcustomer);
                    //db.Configuration.LazyLoadingEnabled = false;


                    
             

                        //Sorting    
                    if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
                    {
                        animalData = animalData.OrderBy(sortColumn + " " + sortColumnDir);
                    }
                    //Search    
                    if (!string.IsNullOrEmpty(searchValue))
                    {
                        animalData = animalData.Where(m => m.Nome.Contains(searchValue));
                    }

                    //total number of rows count     
                    recordsTotal = animalData.Count();
                    //Paging     
                    var data = animalData.Skip(skip).Take(pageSize).ToList();
                    //Returning Json Data    


                    return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception)
                {
                    throw;
                }

        }
        public ActionResult Details(int? id)
        {
            var animals = db.Animals.Include(a => a.Clientes).Include(a => a.Servicos).ToList();
            List<string> servicoscomprados = new List<string>();
            List<string> serviconosanimaissss = new List<string>();
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Animal animal = db.Animals.Find(id);
            if (animal == null)
            {
                return HttpNotFound();
            }

            foreach (var servico in animal.Servicos)
            {
                servicoscomprados.Add(servico.Nome);
                
            }
            ViewBag.servicoscomprados = servicoscomprados.ToList();
            ViewBag.Nome = animal.Nome.ToString();
            return View(animals.ToList());
        }

        public JsonResult States(string Tipo)
        {
            List<string> StatesList = new List<string>();
            switch (Tipo)
            {
                case "Cachorro":
                    StatesList.Add("DEA 1");
                    StatesList.Add("DEA 3");
                    StatesList.Add("DEA 5");
                    StatesList.Add("DEA 7");
                    break;
                case "Gato":
                    StatesList.Add("A");
                    StatesList.Add("B");
                    StatesList.Add("AB");

                    break;

            }
            return Json(new SelectList(StatesList, "TipoSangue", "TipoSangue"), JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create()
        {
            bindState();

            List<string> ListItems = new List<string>();
            ListItems.Add("Select");
            ListItems.Add("Cachorro");
            ListItems.Add("Gato");
            SelectList TiposAnimais = new SelectList(ListItems);
            ViewData["TiposAnimais"] = TiposAnimais;

            var animal = new Animal();
            animal.Servicos = new List<Servicos>();

            ViewBag.ClienteID = new SelectList(db.Clientes, "ClienteID", "Nome");
            ViewBag.ClienteNome = new SelectList(db.Clientes, "Nome", "Nome");
            PopulateAssignedCourseData(animal);
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "AnimalID,Nome,Sexo,Raca,Motivo,Observaçoes,Sangue,Nascimento,Idade,Entrada,Saida,DataCadastro,ClienteNome,Preco,Pagamento,State,City")] Animal animal, string[] selectedServicos)
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
            ViewBag.ClienteNome = new SelectList(db.Clientes, "ClienteID", "Nome", animal.ClienteNome);
            ViewBag.ClienteNome = new SelectList(db.Clientes, "Nome", "Nome");
            PopulateAssignedCourseData(animal);
            return View(animal);
        }
        public ActionResult Edit(int? id)
        {
            bindState();
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
            ViewBag.ClienteNome = new SelectList(db.Clientes, "Nome", "Nome");

            return View(animal);
        }
        // POST: Animals/Edit/5
        // Para se proteger de mais ataques, ative as propriedades específicas a que você quer se conectar. Para 
        // obter mais detalhes, consulte https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit( int? id, string[] selectedServicos)
        {
            bindState();
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var AnimalAtualizar = db.Animals

.Include(i => i.Servicos)
.Where(i => i.AnimalID == id)
.Single();
            
            if (TryUpdateModel(AnimalAtualizar))
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
        [HttpPost]
        public JsonResult DeleteCustomer(int? ID)
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
            {

                var animal = db.Animals.Find(ID);

                if (ID == null)
                    return Json(data: "Not Deleted", behavior: JsonRequestBehavior.AllowGet);
                db.Animals.Remove(animal);
                db.SaveChanges();

                return Json(data: "Deleted", behavior: JsonRequestBehavior.AllowGet);
            }
        }
        // POST: Animal/Delete/5
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

        public JsonResult DeleteAnimal(int? ID)
        {
            using (ProjetoDBContext db = new ProjetoDBContext())
            {

                var animal = db.Animals.Find(ID);

                if (ID == null)
                    return Json(data: "Not Deleted", behavior: JsonRequestBehavior.AllowGet);
                db.Animals.Remove(animal);
                db.SaveChanges();

                return Json(data: "Deleted", behavior: JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpGet]
        //public ActionResult Details()
        //{
        //    bindState();
        //    return View();
        //}  

public void bindState()
        {
            var state = db.TipoAnimals.ToList();
            List<SelectListItem> li = new List<SelectListItem>();
            li.Add(new SelectListItem { Text = "Selecionar", Value = "0" });

            foreach (var m in state)
            {


                li.Add(new SelectListItem { Text = m.Tipoanimal, Value = m.Tipoanimal });
                ViewBag.state = li;

            }
        }  

public JsonResult getCity(string TipoAnimal)
        {
            var ddlCity = db.TipoSangues.Where(x => x.Tipoanimal== TipoAnimal).ToList();
            List<SelectListItem> licities = new List<SelectListItem>();

            licities.Add(new SelectListItem { Text = "Selecionar", Value = "0" });
            if (ddlCity != null)
            {
                foreach (var x in ddlCity)
                {
                    licities.Add(new SelectListItem { Text = x.Tiposangue, Value = x.Tiposangue });
                }
            }
            return Json(new SelectList(licities, "Value", "Text", JsonRequestBehavior.AllowGet));
        }

    }  }
