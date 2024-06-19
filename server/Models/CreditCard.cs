using System;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class CreditCard
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(16, MinimumLength = 16, ErrorMessage = "Card number must be 16 digits.")]
        public string CardNumber { get; set; }

        [Required]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yy}", ApplyFormatInEditMode = true)]
        public DateTime CardIssueDate { get; set; }

        public string CardPicture { get; set; }

        [Required]
        public bool IsCardBlocked { get; set; }

        [Required]
        public bool IsDigitalCard { get; set; }

        [Required]
        [Range(1, 100000, ErrorMessage = "Card limit must be a positive value")]
        public double CreditLimit { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 1)]
        public string BankCode { get; set; }
    }
}
