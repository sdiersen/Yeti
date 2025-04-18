using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class AbstractBaseController<T> : ControllerBase
        where T : class
    {
        protected ILogger logger;

        protected AbstractBaseController(ILogger logger)
        {
            this.logger = logger;
        }

    }

}