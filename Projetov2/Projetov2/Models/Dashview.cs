using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Projeto.Models
{
    public class Dashview
    {
        [Key]
        public int clientes_count { get; set; }
        public int animais_count { get; set; }
        public int funcionarios_count { get; set; }
        public int servicos_count { get; set; }

        public int contagemServicos { get; set; }
        public int contagemAnimais { get; set; }
    }
}