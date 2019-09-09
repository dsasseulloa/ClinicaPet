using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Projeto.Models
{
    public class Servicos
    {
   
        [Key]
        public int ServicoID { get; set; }
        [Display(Name ="Tratamento")]
        public string Nome { get; set; }
        [Display(Name = "Preço")]
        public decimal Preco { get; set; }
        [Display(Name = "Descrição")]
        public string Descricao { get; set; }
        [Display(Name = "Data do Cadastro")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        [DataType(DataType.Date, ErrorMessage = "Data em formato inválido")]
        public DateTime? DataCadastro { get; set; }


        public ICollection<Animal> Animals { get; set; }

        public Servicos()
        {

            this.DataCadastro = DateTime.Now;

        }
    }
}