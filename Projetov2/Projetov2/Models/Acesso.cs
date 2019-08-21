using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Projeto.Models
{
    public class Acesso
    {
        [Key]
        [ForeignKey("Funcionario")]
        public int FuncionarioID { get; set; }
        [Required(ErrorMessage = "Por favor Insira um nome de Usuario")]
        [Index(IsUnique = true)]
        [StringLength(50)]
        public string Usuario { get; set; }
        [DataType(DataType.Password)]
        public string Senha { get; set; }

        public Ativo Ativo { get; set; }
        [Display(Name = "Tipo do Perfil")]
       
        public string Perfil { get; set; }
        [Display(Name = "Data de Cadastro")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? DataCadastro { get; set; }


        public virtual Funcionario Funcionario { get; set; }

        public Acesso()
        {

            this.DataCadastro = DateTime.Now;

        }
    }
    public enum Ativo
    {
       Sim,Não
    }

}