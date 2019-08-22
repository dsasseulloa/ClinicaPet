
using Projeto.Models;
using Projeto.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity;
using Projeto.DAO;

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

        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<Servicos>()
                .HasMany(c => c.Animals).WithMany(i => i.Servicos)
                .Map(t => t.MapLeftKey("ServicoID")
                    .MapRightKey("AnimalID")
                    .ToTable("AnimaleServicos"));

        }

        public ProjetoDBContext()
        {
            Database.SetInitializer(new ProjetoInitializer());
            //this.Configuration.LazyLoadingEnabled = false;
        }

    }
}