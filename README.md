# ClothesRental - ASP.NET Web Forms Application

A comprehensive clothes rental management system built with ASP.NET Web Forms, SQL Server, and Bootstrap.

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
- **Search & Filter**: Advanced filtering capabilities

### 📅 **Booking System**
- **Date Selection**: Interactive date selection with availability checking
- **Customer Details**: Complete customer information capture
- **Price Calculation**: Automatic pricing based on rental duration
- **Status Management**: Track booking lifecycle from confirmed to completed
- **Booking History**: Complete booking records with customer details

### 🎯 **Key Features**
- **Availability Checking**: Real-time availability validation
- **Washing Period**: Automatic washing time calculation after returns
- **Responsive Design**: Mobile-friendly Bootstrap interface
- **Data Persistence**: SQL Server database with proper relationships
- **Form Validation**: Client and server-side validation
- **Status Management**: Complete booking lifecycle tracking

## Technology Stack

- **Framework**: ASP.NET Web Forms 4.8
- **Database**: SQL Server (SSMS compatible)
- **Frontend**: Bootstrap 5, jQuery, Font Awesome
- **Architecture**: 3-tier architecture with Data Access Layer
- **Validation**: ASP.NET validators, client-side validation

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
- .NET Framework 4.8
- SQL Server (LocalDB or full instance)
- Visual Studio 2019/2022 or IIS

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClothesRental
   ```

2. **Setup Database**
   - Open SQL Server Management Studio (SSMS)
   - Run the script from `App_Data/Database.sql`
   - Update connection string in `Web.config` if needed

3. **Configure IIS/Visual Studio**
   - Open project in Visual Studio
   - Set as startup project
   - Build and run (F5)

4. **Access the application**
   - Open browser to `http://localhost:port`
   - Database will be populated with sample data

## Project Structure

```
ClothesRental/
├── App_Code/              # Business Logic Classes
│   ├── DataAccess.cs      # Data Access Layer
│   ├── Product.cs         # Product Entity
│   └── Booking.cs         # Booking Entity
├── App_Data/              # Database Scripts
│   └── Database.sql       # Database creation script
├── Content/               # CSS Files
│   └── Site.css          # Custom styles
├── Scripts/               # JavaScript Files
│   └── site.js           # Custom JavaScript
├── *.aspx                 # Web Forms Pages
├── *.aspx.cs             # Code-behind files
├── Site.Master           # Master Page
├── Site.Master.cs        # Master Page code-behind
└── Web.config            # Configuration file
```

## Key Components

### Data Access Layer
- **DataAccess.cs**: Centralized data access with SQL Server
- **Product.cs**: Product entity with properties and methods
- **Booking.cs**: Booking entity with business logic
- **SQL Server**: Robust database with proper relationships

### Web Forms Pages
- **Default.aspx**: Main page with product availability checking
- **CheckAvailability.aspx**: Date selection and availability validation
- **CreateBooking.aspx**: Customer details and booking creation
- **BookingConfirmation.aspx**: Booking confirmation page
- **Bookings.aspx**: All bookings management
- **Products.aspx**: Product management interface

### Master Page
- **Site.Master**: Consistent layout with Bootstrap navigation
- **Responsive Design**: Mobile-friendly responsive layout
- **Message System**: Centralized success/error messaging

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
1. Update database with new categories
2. Categories will automatically appear in dropdowns
3. Update validation if needed

### Extending Booking Features
1. Add new columns to Bookings table
2. Update DataAccess.cs methods
3. Modify ASPX pages and code-behind accordingly

### Styling Customization
- Modify `Content/Site.css` for custom styles
- Update Bootstrap theme in Master Page
- Add custom JavaScript in `Scripts/site.js`

## Database Connection

Update the connection string in `Web.config`:

```xml
<connectionStrings>
  <add name="ClothesRentalConnectionString" 
       connectionString="Data Source=YourServer;Initial Catalog=ClothesRental;Integrated Security=True" 
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the sample code and comments