using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class WatchlistStock
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("Watchlist")]
        public int WatchlistId { get; set; }
        [ForeignKey("Stock")]
        public int StockId { get; set; }
    }
}
