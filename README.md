# ClothesRental - ASP.NET Core MVC Application

A comprehensive clothes rental management system built with ASP.NET Core MVC, Entity Framework Core, and Bootstrap.

## Features

### 🏠 **Home Page**
- **Product Availability & Status**: Check product availability by date with advanced filtering
- **Search & Filter**: Search by product code or name, filter by category and status
- **Real-time Status**: Visual indicators for product availability
- **Quick Booking**: Direct booking from availability checker

### 👔 **Product Management**
- **Product Catalog**: Complete product listing with images and details
- **Product Codes**: Unique codes for easy identification (ED-001, CD-002, etc.)
- **Categories**: Formal, Cocktail, Wedding, Business, Casual
- **Status Tracking**: Available, Delivered, Reserved, Washing
- **CRUD Operations**: Create, Read, Update, Delete products

### 📅 **Booking System**
- **Date Selection**: Interactive calendar with availability checking
- **Customer Details**: Complete customer information capture
- **Price Calculation**: Automatic pricing based on rental duration
- **Status Management**: Track booking lifecycle from confirmed to completed
- **Booking History**: Complete booking records with customer details

### 🎯 **Key Features**
- **Availability Checking**: Real-time availability validation
- **Washing Period**: Automatic washing time calculation after returns
- **Responsive Design**: Mobile-friendly Bootstrap interface
- **Data Persistence**: Entity Framework Core with SQL Server
- **Form Validation**: Client and server-side validation
- **Status Management**: Complete booking lifecycle tracking

## Technology Stack

- **Framework**: ASP.NET Core 8.0 MVC
- **Database**: Entity Framework Core with SQL Server
- **Frontend**: Bootstrap 5, jQuery, Font Awesome
- **Architecture**: Repository Pattern with Services
- **Validation**: Data Annotations, Client-side validation

## Database Schema

### Products Table
- Id, Code, Name, Description, ImageUrl
- PricePerDay, Category, Size, Color
- Status, WashingDays, CreatedAt

### Bookings Table
- Id, ProductId, StartDate, EndDate
- DeliveryDate, ReturnDate, WashingStartDate, WashingEndDate
- TotalPrice, Status, CreatedAt
- CustomerName, CustomerEmail, CustomerPhone, CustomerAddress

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClothesRental
   ```

2. **Update connection string**
   ```json
   // appsettings.json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ClothesRentalDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Restore packages**
   ```bash
   dotnet restore
   ```

4. **Run the application**
   ```bash
   dotnet run
   ```

5. **Access the application**
   - Open browser to `https://localhost:5001`
   - Database will be created automatically with sample data

## Project Structure

```
ClothesRental/
├── Controllers/           # MVC Controllers
│   ├── HomeController.cs
│   ├── ProductsController.cs
│   └── BookingsController.cs
├── Models/               # Data Models
│   ├── Product.cs
│   ├── Booking.cs
│   └── ViewModels/
├── Services/             # Business Logic
│   ├── IProductService.cs
│   ├── ProductService.cs
│   ├── IBookingService.cs
│   └── BookingService.cs
├── Data/                 # Database Context
│   └── ApplicationDbContext.cs
├── Views/                # Razor Views
│   ├── Home/
│   ├── Products/
│   ├── Bookings/
│   └── Shared/
└── wwwroot/              # Static Files
    ├── css/
    ├── js/
    └── lib/
```

## Key Components

### Services Layer
- **ProductService**: Product management and availability checking
- **BookingService**: Booking creation and status management
- **Dependency Injection**: Services registered in Program.cs

### Data Layer
- **ApplicationDbContext**: Entity Framework context
- **Seed Data**: Sample products and bookings
- **Migrations**: Database schema management

### Controllers
- **HomeController**: Main page and availability checking
- **ProductsController**: Product CRUD operations
- **BookingsController**: Booking management

### Views
- **Responsive Design**: Bootstrap-based responsive layouts
- **Partial Views**: Reusable components
- **Form Validation**: Client and server-side validation

## Sample Data

The application includes sample products:
- **ED-001**: Elegant Evening Dress ($45/day)
- **CD-002**: Designer Cocktail Dress ($35/day)
- **TX-003**: Classic Tuxedo ($60/day)
- **WD-004**: Summer Wedding Dress ($40/day)
- **BS-005**: Business Suit ($50/day)
- **BM-006**: Bohemian Maxi Dress ($30/day)

## Features in Detail

### Availability System
- Real-time availability checking
- Washing period calculation
- Date range validation
- Conflict prevention

### Booking Workflow
1. Select product and dates
2. Check availability
3. Enter customer details
4. Confirm booking
5. Track status through lifecycle

### Status Management
- **Confirmed**: Booking created
- **Delivered**: Item delivered to customer
- **Active**: Currently in use
- **Returned**: Item returned by customer
- **Washing**: Item being cleaned
- **Completed**: Booking finished
- **Cancelled**: Booking cancelled

## Customization

### Adding New Product Categories
1. Update seed data in `ApplicationDbContext.cs`
2. Add category to dropdown lists in views
3. Update validation if needed

### Extending Booking Features
1. Add new properties to `Booking` model
2. Update database context and run migration
3. Modify views and services accordingly

### Styling Customization
- Modify `wwwroot/css/site.css` for custom styles
- Update Bootstrap theme in `_Layout.cshtml`
- Add custom JavaScript in `wwwroot/js/site.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the sample code and comments