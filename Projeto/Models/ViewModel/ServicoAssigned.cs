using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Projeto.Models.ViewModel
{
    public class ServicoAssignedData
    {
        [Key]
        public int ServicoID { get; set; }
        public string Nome { get; set; }
        public bool Assigned { get; set; }
    }
}