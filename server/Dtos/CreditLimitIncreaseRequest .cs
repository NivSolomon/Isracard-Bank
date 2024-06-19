namespace server.Models
{
    public class CreditLimitIncreaseRequest
    {
        public string CardId { get; set; }
        public double RequestedFrameAmount { get; set; }
        public double AverageMonthlyIncome { get; set; }
        public string Occupation { get; set; }
    }
}
