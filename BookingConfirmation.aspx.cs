using System;
using System.Web.UI;

public partial class BookingConfirmation : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            int bookingId;
            if (int.TryParse(Request.QueryString["id"], out bookingId))
            {
                LoadBookingDetails(bookingId);
            }
            else
            {
                Response.Redirect("Default.aspx");
            }
        }
    }

    private void LoadBookingDetails(int bookingId)
    {
        // For simplicity, we'll get the product details and show confirmation
        // In a real application, you would have a GetBookingById method
        litBookingId.Text = bookingId.ToString();
        
        // You can enhance this by storing booking details in session or database
        // For now, showing a generic confirmation
    }

    protected void btnBackToHome_Click(object sender, EventArgs e)
    {
        Response.Redirect("Default.aspx");
    }

    protected void btnViewBookings_Click(object sender, EventArgs e)
    {
        Response.Redirect("Bookings.aspx");
    }
}