
using Projeto.Models;
using Projeto.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity;
using Projeto.DAO;
using Projeto.Models.Tipos;

namespace Projeto.DAO
{
    public class ProjetoDBContext : DbContext
    {
        public virtual DbSet<Animal> Animals { get; set; }
        public virtual DbSet<Cliente> Clientes { get; set; }
        public virtual DbSet<Funcionario> Funcionarios { get; set; }
        public virtual DbSet<Servicos> Servicos { get; set; }
        public virtual DbSet<Acesso> Acessos { get; set; }
        public virtual DbSet<Dashview> Dashview { get; set; }
        public virtual DbSet<TipoAnimal> TipoAnimals { get; set; }
        public virtual DbSet<TipoSangue> TipoSangues { get; set; }
        public virtual DbSet<ExpenseReport> ExpenseReport { get; set; }
        //public virtual DbSet<ArchiveEntry> ArchiveEntry { get; set; }






        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<Servicos>()
                .HasMany(c => c.Animals).WithMany(i => i.Servicos)
                .Map(t => t.MapLeftKey("ServicoID")
                    .MapRightKey("AnimalID")
                    .ToTable("AnimaleServicos"));

            modelBuilder.Entity<Cliente>()
    .HasMany<Animal>(c => c.Animals)
    .WithOptional(x => x.Clientes)
    .WillCascadeOnDelete(true);

        }

        public ProjetoDBContext()
        {
            Database.SetInitializer(new ProjetoInitializer());
            //this.Configuration.LazyLoadingEnabled = false;
        }

    }
}