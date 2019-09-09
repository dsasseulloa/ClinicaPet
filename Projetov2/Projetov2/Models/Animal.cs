using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataTables;

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
      
        
        [DisplayFormat(NullDisplayText = "SRD", ApplyFormatInEditMode = true)]
        
        [Range(0, 50)]
        public int? Idade { get; set; }
        [Display(Name = "Data de Entrada")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        [DataType(DataType.Date, ErrorMessage = "Data em formato inválido")]
        public DateTime Entrada { get; set; }
        
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        [DataType(DataType.Date, ErrorMessage = "Data em formato inválido")]
        [Display(Name = "Previsão de Saída")]
        public DateTime? Saida { get; set; }
        [Display(Name = "Data de Cadastro")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        [DataType(DataType.Date, ErrorMessage = "Data em formato inválido")]
        public DateTime? DataCadastro { get; set; }
        
        [DisplayFormat(NullDisplayText = "Outro", ApplyFormatInEditMode = true)]
        public int Contagem { get;set; }


      
        public string ClienteNome { get; set; }
        public int? ClienteID { get; set; }

        public string Pagamento { get; set; }
        [Display(Name = "Tipo de Animal")]
        [DisplayFormat(NullDisplayText = "Gato", ApplyFormatInEditMode = true)]
        public string _tipo;
        public string Tipo { get; set; }
        [Display(Name = "Tipo Sanguíneo")]
        public string TipoSangue { get; set; }
      
        public string State { get; set; }
      
        public string City { get; set; }

        [DataType(DataType.Currency)]
        [Range(10, 99999.99,ErrorMessage = "O Preço de Venda deve estar entre " + "10,00 e 99999,99.")]
        [DisplayName("Preço do Serviço")]
        [DisplayFormat(DataFormatString = "{0:C0}")]
        [AllowHtml]
        public decimal Preco{ get; set; }

  public Funcionario Funcionarios { get; set; }
        public Cliente Clientes { get; set; }
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