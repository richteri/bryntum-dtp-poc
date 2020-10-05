using Microsoft.AspNetCore.Mvc;

namespace BryntumGanttDemo.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return Redirect(Url.Content("~/index.html"));
        }
    }
}
