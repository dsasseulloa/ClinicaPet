using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Projeto.Models.Tipos
{
    public class TipoAnimal
    {

        [Key]
        public int TipoanimalID { get; set; }
        public string Tipoanimal { get; set; }
        
        
    }
}