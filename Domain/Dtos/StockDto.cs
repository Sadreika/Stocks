namespace Domain.Dtos
{
    public class StockDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public string Symbol { get; set; }
        public decimal Yield { get; set; }
        public string MarketCap { get; set; }
    }
}

