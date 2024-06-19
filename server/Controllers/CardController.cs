using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardController : ControllerBase
    {
        private readonly ICardRepository _cardRepository;

        public CardController(ICardRepository cardRepository)
        {
            _cardRepository = cardRepository;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetCardsAsync()
        {
            try
            {
                var cards = await _cardRepository.GetAllCardsAsync();
                if (cards != null)
                {
                    return Ok(cards);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, "No Cards found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving Cards.");
            }
        }
        [Authorize]
        [HttpPut("creditLimitIncrease")]
        public async Task<IActionResult> IncreaseCreditLimit([FromBody] CreditLimitIncreaseRequest formData)
        {
            try
            {
                if (!Guid.TryParse(formData.CardId, out Guid cardId))
                {
                    return BadRequest("Invalid CardId format");
                }

                var card = await _cardRepository.GetCardByIdAsync(cardId);
                if (card == null)
                {
                    return NotFound("Card not found");
                }

                if (card.IsCardBlocked)
                {
                    return BadRequest("Card is blocked. Cannot increase credit limit.");
                }

                if (formData.RequestedFrameAmount <= 0 || formData.RequestedFrameAmount > 100000)
                {
                    return BadRequest("Requested frame amount must be between 1 and 100000");
                }

                if (formData.RequestedFrameAmount > formData.AverageMonthlyIncome * 0.333 && formData.Occupation == "self-employed")
                {
                    return BadRequest("Requested frame amount exceeds maximum allowed for self-employed individuals");
                }
                else if (formData.RequestedFrameAmount > formData.AverageMonthlyIncome * 0.5 && formData.Occupation == "salaried")
                {
                    return BadRequest("Requested frame amount exceeds maximum allowed for salaried employees");
                }

                if (formData.AverageMonthlyIncome < 12000)
                {
                    return BadRequest("Average monthly income is below 12000. Cannot increase credit limit.");
                }

                var cardIssueDateLimit = DateTime.UtcNow.AddMonths(-3);
                if (card.CardIssueDate > cardIssueDateLimit)
                {
                    return BadRequest("Card was issued in the last 3 months. Cannot increase credit limit.");
                }
                System.Console.WriteLine(formData.RequestedFrameAmount);
                System.Console.WriteLine(formData.AverageMonthlyIncome);
                card.CreditLimit = formData.RequestedFrameAmount;

                await _cardRepository.UpdateCardAsync(card);

                return Ok("Credit limit increased successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in IncreaseCreditLimit: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while increasing credit limit");
            }
        }
        [Authorize]
        [HttpGet("filter")]
        public async Task<IActionResult> FilterCardsAsync([FromQuery] bool? isBlocked, [FromQuery] string? cardNumber, [FromQuery] string? bankCode)
        {
            try
            {
                var filteredCards = await _cardRepository.FilterCardsAsync(isBlocked, cardNumber, bankCode);
                if (filteredCards != null)
                {
                    return Ok(filteredCards);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, "No Cards found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in FilterCardsAsync: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while filtering Cards.");
            }
        }

    }
}
