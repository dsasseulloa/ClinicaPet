using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using System.ComponentModel.DataAnnotations;

namespace Projeto.Models
{
    public class ArchiveEntry
    {
        //[Key]
        //public int Id { get; set; }
        public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName
    {
        get
        {
            return CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(this.Month);
        }
    }
    public int Total { get; set; }
        public decimal Vendas { get; set; }
    }
}


