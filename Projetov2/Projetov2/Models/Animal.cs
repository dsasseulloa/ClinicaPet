using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
        
        [DisplayFormat(NullDisplayText = "SRD", ApplyFormatInEditMode = true)]
        
        [Range(0, 50)]
        public int? Idade { get; set; }
        [Display(Name = "Data de Entrada")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Entrada { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        [Display(Name = "Previsão de Saída")]
        public DateTime? Saida { get; set; }
        [Display(Name = "Data de Cadastro")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? DataCadastro { get; set; }
        
        [DisplayFormat(NullDisplayText = "Outro", ApplyFormatInEditMode = true)]
        public int Contagem { get;set; }


        public Funcionario Funcionarios { get; set; }
        public Cliente Clientes { get; set; }
        public string ClienteNome { get; set; }
        public int? ClienteID { get; set; }

        public string Pagamento { get; set; }
        [Display(Name = "Tipo de Animal")]
        [DisplayFormat(NullDisplayText = "Gato", ApplyFormatInEditMode = true)]
        public string _tipo;
        public IEnumerable<SelectListItem> Tipo { get; set; }
        public IEnumerable<SelectListItem> TipoSangue { get; set; }
        


        [Range(10, 99999.99,ErrorMessage = "O Preço de Venda deve estar entre " + "10,00 e 99999,99.")]
        [DisplayName("Preço do Serviço")]
        [DisplayFormat(DataFormatString = "{0:C0}")]
        public decimal? Preco{ get; set; }
        private ICollection<Servicos> _servicos;
        public  ICollection<Servicos> Servicos
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



    }



}