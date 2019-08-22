using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages.Html;

namespace Projeto.Models
{
    public class Funcionario
    {
        [Key]
        public int FuncionarioID { get; set; }
        [Display(Name = "Nome Completo")]
        [Required(ErrorMessage = "Nome deve ser preenchido!")]
        public string Nome { get; set; }
        public string Sexo { get; set; }
        public string CPFouRG { get; set; }
        [DataType(DataType.Date)]
        [Display(Name = "Data de Nascimento")]
        public DateTime DataNascimento { get; set; }
        [DataType(DataType.Currency)]
        public decimal? Salario { get; set; }
        public string Contato { get; set; }
        public string Contato2 { get; set; }
        public string Endereço { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string CEP { get; set; }
        [RegularExpression("^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$", ErrorMessage = "E-mail inválido!")]
        [DataType(DataType.EmailAddress, ErrorMessage = "E-mail is not valid")]
        public string Email { get; set; }
        public Cargo? Cargo { get; set; }
        [DataType(DataType.Date)]
        [Display(Name = "Data de Admissão")]
        public DateTime DataAdmissao { get; set; }
        [Display(Name = "Data de Cadastro")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? DataCadastro { get; set; }

        public virtual ICollection<Animal> Animals { get; set; }
        public virtual ICollection<Cliente> Clientes { get; set; }
        public virtual Acesso Acesso { get; set; }

    }
    public enum Cargo
    {
        [Display(Name = "Veterinário")]
        [Description("Veterinário")]
        Veterinário = 0,
        [Display(Name = "Administrador")]
        [Description("Administrador")]
        Administrador = 1,
        [Display(Name = "Fisioterapeuta")]
        [Description("Fisioterapeuta")]
        Fisioterapeuta = 2,
        [Display(Name = "Nutricionista")]
        [Description("Nutricionista")]
        Nutricionista = 3,
        [Display(Name = "Tosador")]
        [Description("Tosador")]
        Tosador = 4,
        [Display(Name = "Banhista")]
        [Description("Banhista")]
        Banhista = 5,
        [Display(Name = "Recepcionista")]
        [Description("Recepcionista")]
        Recepcionista = 6,
        [Display(Name = "Assistente de Limpeza")]
        [Description("Assistente")]
        Assistente = 7,
        [Display(Name = "Motorista")]
        [Description("Motorista")]
        Motorista = 8,
    }
}