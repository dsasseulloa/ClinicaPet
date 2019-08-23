using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlTypes;
using System.Linq;
using System.Web;

namespace Projeto.Models
{
    
    public class Cliente
    {
        public Cliente()
        {
            //Animals = new HashSet<Animal>();
            this.DataCadastro = DateTime.Now;

        }
        [Key]
        public int ClienteID { get; set; }
        [Display(Name = "Nome do Cliente")]
        [Required(ErrorMessage = "Campo Nome do Cliente é Obrigatório ")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Nome precisa ter entre 3 e 50 Caracteres")]
        public string Nome { get; set; }
        [Required(ErrorMessage = "Campo Sexo é Obrigatório ")]
        public string Sexo { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = false)]
        [Display(Name = "Data de Nascimento")]
        public DateTime DataNascimento { get; set; }

        [Index(IsUnique = true)]
        [StringLength(50)]
        [Display(Name = "CPF")]
        [Required(ErrorMessage ="Campo CPF é obrigatório")]
        //[RegularExpression(@"([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})", ErrorMessage = "Por favor insira 11 dígitos no formato:12345678901")]
        public string CPFouRG { get; set; }
        [Required(ErrorMessage = "Campo de Contato é Obrigatório ")]
        public string Contato { get; set; }
        public string Contato2 { get; set; }
        public string Endereço { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string CEP { get; set; }
        //[RegularExpression("^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$", ErrorMessage = "E-mail inválido!")]
        [DataType(DataType.EmailAddress, ErrorMessage = "Este E-mail não é valido")]
        public string Email { get; set; }
        //[DataType(DataType.Date)]

        [Display(Name = "Data de Cadastro")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? DataCadastro { get; set; }


        public ICollection<Animal> Animals { get; set; }
        public Funcionario Funcionarios { get; set; }
     


    }
}