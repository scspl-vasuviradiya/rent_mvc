using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;

public partial class CustomerDetails : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            string customerEmail = Request.QueryString["email"];
            if (!string.IsNullOrEmpty(customerEmail))
            {
                LoadCustomerDetails(customerEmail);
                LoadBookingHistory(customerEmail);
            }
            else
            {
                Response.Redirect("CustomerManagement.aspx");
            }
        }
    }

    private void LoadCustomerDetails(string customerEmail)
    {
        try
        {
            List<Booking> customerBookings = dataAccess.GetBookingsByCustomerEmail(customerEmail);
            
            if (customerBookings.Count > 0)
            {
                Booking firstBooking = customerBookings.First();
                
                // Display customer information
                litCustomerName.Text = firstBooking.CustomerName;
                litCustomerEmail.Text = firstBooking.CustomerEmail;
                litEmailAddress.Text = firstBooking.CustomerEmail;
                litPhoneNumber.Text = firstBooking.CustomerPhone;
                litAddress.Text = firstBooking.CustomerAddress;
                
                // Calculate statistics
                litTotalBookings.Text = customerBookings.Count.ToString();
                decimal totalSpent = customerBookings.Sum(b => b.TotalPrice);
                litTotalSpent.Text = totalSpent.ToString("F2");
                
                decimal avgBookingValue = customerBookings.Count > 0 ? totalSpent / customerBookings.Count : 0;
                litAvgBookingValue.Text = "$" + avgBookingValue.ToString("F0");
                
                // Set page title
                Page.Title = firstBooking.CustomerName + " - Customer Details";
            }
            else
            {
                ((SiteMaster)Master).ShowMessage("Customer not found.", "danger");
                Response.Redirect("CustomerManagement.aspx");
            }
        }
        catch (Exception ex)
        {
            ((SiteMaster)Master).ShowMessage("Error loading customer details: " + ex.Message, "danger");
        }
    }

    private void LoadBookingHistory(string customerEmail)
    {
        try
        {
            List<Booking> bookings = dataAccess.GetBookingsByCustomerEmail(customerEmail);
            
            if (bookings.Count > 0)
            {
                // Sort by most recent first
                bookings = bookings.OrderByDescending(b => b.CreatedAt).ToList();
                
                rptBookingHistory.DataSource = bookings;
                rptBookingHistory.DataBind();
                rptBookingHistory.Visible = true;
                pnlNoBookings.Visible = false;
            }
            else
            {
                rptBookingHistory.Visible = false;
                pnlNoBookings.Visible = true;
            }
        }
        catch (Exception ex)
        {
            ((SiteMaster)Master).ShowMessage("Error loading booking history: " + ex.Message, "danger");
        }
    }

    protected void btnBackToCustomers_Click(object sender, EventArgs e)
    {
        Response.Redirect("CustomerManagement.aspx");
    }
}