using System.Web;
using System.Web.Optimization;

namespace Projetov2
{
    public class BundleConfig
    {
        // Para obter mais informações sobre o agrupamento, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/admilte2/jquery/dist/jquery.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use a versão em desenvolvimento do Modernizr para desenvolver e aprender. Em seguida, quando estiver
            // pronto para a produção, utilize a ferramenta de build em https://modernizr.com para escolher somente os testes que precisa.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/admilte2/bootstrap/dist/js/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/admilte2/bootstrap/dist/css/bootstrap.css",
                      "~/admilte2/css/AdminLTE.css",
                      "~/admilte2/css/skins/skin-blue.css",
                      "~/admilte2/datatables.net-bs/css/dataTables.bootstrap.css"

                      ));
            bundles.Add(new ScriptBundle("~/admin-lte/js").Include(
             "~/admilte2/js/adminlte.js",
              "~/admilte2/plugins/fastclick/fastclick.js"));
        }
    }
}
