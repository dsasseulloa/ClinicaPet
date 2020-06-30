using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Projeto.Models
{
    public class AnimaleServico
    {
        [Column(Order = 1)]
        public int AnimalID { get; set; }
        public Animal Animal { get; set; }
        [Column(Order = 2)]
        public int ServicoID { get; set; }
        public Servicos Servicos { get; set; }

    }
}