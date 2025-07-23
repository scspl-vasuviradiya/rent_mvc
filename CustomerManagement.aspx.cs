using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CustomerManagement : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadCustomerStats();
            LoadCustomers();
        }
    }

    private void LoadCustomerStats()
    {
        try
        {
            List<Booking> allBookings = dataAccess.GetBookings();
            
            // Get unique customers
            var uniqueCustomers = allBookings
                .GroupBy(b => b.CustomerEmail)
                .Select(g => new
                {
                    Email = g.Key,
                    Name = g.First().CustomerName,
                    TotalBookings = g.Count(),
                    TotalSpent = g.Sum(b => b.TotalPrice),
                    LastBooking = g.Max(b => b.CreatedAt)
                })
                .ToList();

            litTotalCustomers.Text = uniqueCustomers.Count.ToString();
            litTotalBookings.Text = allBookings.Count.ToString();
            litTotalRevenue.Text = allBookings.Where(b => b.Status.ToLower() != "cancelled").Sum(b => b.TotalPrice).ToString("F2");
            
            // Active customers (booked in last 30 days)
            DateTime thirtyDaysAgo = DateTime.Now.AddDays(-30);
            int activeCustomers = uniqueCustomers.Count(c => c.LastBooking >= thirtyDaysAgo);
            litActiveCustomers.Text = activeCustomers.ToString();
        }
        catch (Exception ex)
        {
            ((SiteMaster)Master).ShowMessage("Error loading customer statistics: " + ex.Message, "danger");
        }
    }

    private void LoadCustomers()
    {
        try
        {
            List<Booking> allBookings = dataAccess.GetBookings();
            string searchTerm = txtSearchCustomer.Text.Trim().ToLower();
            string sortBy = ddlSortBy.SelectedValue;
            
            // Group bookings by customer
            var customers = allBookings
                .GroupBy(b => b.CustomerEmail)
                .Select(g => new
                {
                    CustomerName = g.First().CustomerName,
                    CustomerEmail = g.Key,
                    CustomerPhone = g.First().CustomerPhone,
                    CustomerAddress = g.First().CustomerAddress,
                    TotalBookings = g.Count(),
                    TotalSpent = g.Sum(b => b.TotalPrice),
                    LastBooking = g.Max(b => b.CreatedAt),
                    LastBookingDays = (DateTime.Now - g.Max(b => b.CreatedAt)).Days
                })
                .Where(c => string.IsNullOrEmpty(searchTerm) || 
                           c.CustomerName.ToLower().Contains(searchTerm) || 
                           c.CustomerEmail.ToLower().Contains(searchTerm))
                .ToList();

            // Sort customers
            switch (sortBy)
            {
                case "bookings":
                    customers = customers.OrderByDescending(c => c.TotalBookings).ToList();
                    break;
                case "revenue":
                    customers = customers.OrderByDescending(c => c.TotalSpent).ToList();
                    break;
                case "recent":
                    customers = customers.OrderByDescending(c => c.LastBooking).ToList();
                    break;
                default: // name
                    customers = customers.OrderBy(c => c.CustomerName).ToList();
                    break;
            }

            if (customers.Count > 0)
            {
                rptCustomers.DataSource = customers;
                rptCustomers.DataBind();
                rptCustomers.Visible = true;
                pnlNoCustomers.Visible = false;
            }
            else
            {
                rptCustomers.Visible = false;
                pnlNoCustomers.Visible = true;
            }
        }
        catch (Exception ex)
        {
            ((SiteMaster)Master).ShowMessage("Error loading customers: " + ex.Message, "danger");
        }
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        LoadCustomers();
    }

    protected void rptCustomers_ItemCommand(object source, RepeaterCommandEventArgs e)
    {
        if (e.CommandName == "ViewCustomer")
        {
            string customerEmail = e.CommandArgument.ToString();
            Response.Redirect($"CustomerDetails.aspx?email={Server.UrlEncode(customerEmail)}");
        }
    }
}