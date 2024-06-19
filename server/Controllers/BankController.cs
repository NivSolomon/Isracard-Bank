using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BankController : ControllerBase
    {
        private readonly IBankRepository _bankRepository;

        public BankController(IBankRepository bankRepository)
        {
            _bankRepository = bankRepository;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetBanksAsync()
        {
            try
            {
                var banks = await _bankRepository.GetBanksAsync();
                if (banks != null)
                {
                    return Ok(banks);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, "No banks found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving banks: {ex.Message}"); 

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving banks.");
            }
        }
    }
}
