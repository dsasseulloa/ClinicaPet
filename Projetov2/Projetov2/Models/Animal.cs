using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Projeto.Models
{
    public class Animal
    {

        [Key]
        public int AnimalID { get; set; }

        [Display(Name = "Nome do Animal")]
        [Required(ErrorMessage = "Campo Nome do Pet é Obrigatório ")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Nome precisa ter entre 2 e 50 caracteres")]
        public string Nome { get; set; }
        [Required(ErrorMessage = "Campo Sexo é Obrigatório ")]
        public string Sexo { get; set; }
        [Display(Name = "Raça")]
        [DisplayFormat(NullDisplayText = "SRD", ApplyFormatInEditMode = true)]
        public string Raca { get; set; }
        [Display(Name = "Finalidade")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Favor inserir menos de 100 caracteres.")]
        public string Motivo { get; set; }
        [Display(Name = "Observações")]
        [StringLength(300, MinimumLength = 3, ErrorMessage = "Favor inserir menos de 300 caracteres.")]
        public string Observaçoes { get; set; }
        [Display(Name = "Tipo Sanguíneo")]
        public Sangue? Sangue { get; set; }
        [DisplayFormat(NullDisplayText = "SRD", ApplyFormatInEditMode = true)]
        public string TipoSangue { get; set; }
        [Range(0, 50)]
        public int? Idade { get; set; }
        [Display(Name = "Data de Entrada")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Entrada { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        [Display(Name = "Data de Saída")]
        public DateTime? Saida { get; set; }
        [Display(Name = "Data de Cadastro")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? DataCadastro { get; set; }
        [Display(Name = "Tipo de Animal")]
        [DisplayFormat(NullDisplayText = "Outro", ApplyFormatInEditMode = true)]
        public Tipo? Tipo { get; set; }

        public virtual Funcionario Funcionarios { get; set; }

        public int? ClienteID { get; set; }
        public virtual Cliente Clientes { get; set; }


        private ICollection<Servicos> _servicos;
        public virtual ICollection<Servicos> Servicos
        {
            get
            {
                return _servicos ?? (_servicos = new List<Servicos>());
            }
            set
            {
                _servicos = value;
            }
        }

        public Animal()
        {

            this.DataCadastro = DateTime.Now;

        }

        [DataType(DataType.Currency)]
        public decimal Preco { get; set; } //a ligar a serviços

    }
    public enum Sangue
    {
        [Display(Name = "A+")]
        [Description("A+")]
        apositivo = 0,
        [Display(Name = "A-")]
        [Description("A-")]
        anegativo = 1,
        [Display(Name = "B+")]
        [Description("B+")]
        bpositivo = 2,
        [Display(Name = "B-")]
        [Description("B-")]
        bnegativo = 3,
        [Display(Name = "AB+")]
        [Description("AB+")]
        abpositivo = 4,
        [Display(Name = "AB-")]
        [Description("AB-")]
        abnegativo = 5,
        [Display(Name = "O+")]
        [Description("O+")]
        opositivo = 6,
        [Display(Name = "O-")]
        [Description("O-")]
        onegativo = 7,

    }
    public enum Tipo
    {
        [Display(Name = "Outro")]
        [Description("Outro")]
        Outro = 0,
        [Display(Name = "Cachorro")]
        [Description("Outro")]
        Cachorro = 1,
        [Display(Name = "Gato")]
        [Description("Outro")]
        Gato = 2,
    }
}