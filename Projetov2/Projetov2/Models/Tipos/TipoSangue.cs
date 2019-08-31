using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Projeto.Models.Tipos
{
    public class TipoSangue
    {
        [Key]
        public int TipoSangueID { get; set; }
        public string Tiposangue { get; set; }
        public int TipoAnimalID { get; set; }
        public string Tipoanimal { get; set; }

  
    }
}