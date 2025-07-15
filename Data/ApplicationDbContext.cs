using Microsoft.EntityFrameworkCore;
using ClothesRental.Models;

namespace ClothesRental.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        
        public DbSet<Product> Products { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Product configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Code).IsUnique();
                entity.Property(e => e.PricePerDay).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).HasConversion<string>();
            });
            
            // Booking configuration
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).HasConversion<string>();
                
                entity.HasOne(e => e.Product)
                      .WithMany(e => e.Bookings)
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            
            // Seed data
            SeedData(modelBuilder);
        }
        
        private void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Code = "ED-001",
                    Name = "Elegant Evening Dress",
                    Description = "Stunning black evening dress perfect for formal events",
                    ImageUrl = "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
                    PricePerDay = 45.00m,
                    Category = "Formal",
                    Size = "M",
                    Color = "Black",
                    Status = ProductStatus.Available,
                    WashingDays = 2
                },
                new Product
                {
                    Id = 2,
                    Code = "CD-002",
                    Name = "Designer Cocktail Dress",
                    Description = "Chic red cocktail dress for special occasions",
                    ImageUrl = "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400",
                    PricePerDay = 35.00m,
                    Category = "Cocktail",
                    Size = "S",
                    Color = "Red",
                    Status = ProductStatus.Available,
                    WashingDays = 2
                },
                new Product
                {
                    Id = 3,
                    Code = "TX-003",
                    Name = "Classic Tuxedo",
                    Description = "Premium black tuxedo for formal events",
                    ImageUrl = "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
                    PricePerDay = 60.00m,
                    Category = "Formal",
                    Size = "L",
                    Color = "Black",
                    Status = ProductStatus.Available,
                    WashingDays = 3
                },
                new Product
                {
                    Id = 4,
                    Code = "WD-004",
                    Name = "Summer Wedding Dress",
                    Description = "Light blue wedding guest dress",
                    ImageUrl = "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400",
                    PricePerDay = 40.00m,
                    Category = "Wedding",
                    Size = "M",
                    Color = "Blue",
                    Status = ProductStatus.Available,
                    WashingDays = 2
                },
                new Product
                {
                    Id = 5,
                    Code = "BS-005",
                    Name = "Business Suit",
                    Description = "Professional navy business suit",
                    ImageUrl = "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
                    PricePerDay = 50.00m,
                    Category = "Business",
                    Size = "L",
                    Color = "Navy",
                    Status = ProductStatus.Available,
                    WashingDays = 3
                },
                new Product
                {
                    Id = 6,
                    Code = "BM-006",
                    Name = "Bohemian Maxi Dress",
                    Description = "Flowing bohemian dress perfect for outdoor events",
                    ImageUrl = "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400",
                    PricePerDay = 30.00m,
                    Category = "Casual",
                    Size = "S",
                    Color = "Floral",
                    Status = ProductStatus.Available,
                    WashingDays = 1
                }
            );
        }
    }
}