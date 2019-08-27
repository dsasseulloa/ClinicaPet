using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projeto.Models
{
    public class BarChartViewModel
    {
        public BarChartViewModel()
        {
            Male = new List<int>();
            Female = new List<int>();
        }
        public ICollection<int> Male { get; set; }
        public ICollection<int> Female { get; set; }
    }
}