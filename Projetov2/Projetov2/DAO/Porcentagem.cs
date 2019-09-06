using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projeto.DAO
{
    static class Porcentagem
    {
        public static Single Perc(Single Base, Single Amostra)
        {

            return ((Amostra * 100) / Base);
        }
    }
}