using Persistence.ModelValidations;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class AbstractBaseController<T> : ControllerBase
        where T : class
    {
        protected IDbServicesInterface<T> _dbService;
        protected ILogger logger;

        protected AbstractBaseController(IDbServicesInterface<T> dbService,
                                        ILogger logger)
        {
            _dbService = dbService;
            this.logger = logger;
        }

    }

}