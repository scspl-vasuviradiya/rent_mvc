using System;
using System.Web.UI;

public partial class CreateBooking : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            int productId;
            DateTime startDate, endDate;
            
            if (int.TryParse(Request.QueryString["productId"], out productId) &&
                DateTime.TryParse(Request.QueryString["startDate"], out startDate) &&
                DateTime.TryParse(Request.QueryString["endDate"], out endDate))
            {
                LoadBookingDetails(productId, startDate, endDate);
            }
            else
            {
                Response.Redirect("Default.aspx");
            }
        }
    }

    private void LoadBookingDetails(int productId, DateTime startDate, DateTime endDate)
    {
        Product product = dataAccess.GetProductById(productId);
        if (product != null)
        {
            // Store values in ViewState
            ViewState["ProductId"] = productId;
            ViewState["StartDate"] = startDate;
            ViewState["EndDate"] = endDate;
            ViewState["TotalPrice"] = dataAccess.CalculateTotalPrice(productId, startDate, endDate);
            
            // Display product info
            imgProduct.ImageUrl = product.ImageUrl;
            litProductName.Text = product.Name;
            litProductCode.Text = product.Code;
            litStartDate.Text = startDate.ToString("MMM dd, yyyy");
            litEndDate.Text = endDate.ToString("MMM dd, yyyy");
            
            int totalDays = (endDate - startDate).Days + 1;
            litTotalDays.Text = totalDays.ToString();
            litTotalPrice.Text = ((decimal)ViewState["TotalPrice"]).ToString("F2");
            
            // Update button text
            btnCompleteBooking.Text = $"Complete Booking (${((decimal)ViewState["TotalPrice"]):F2})";
        }
    }

    protected void btnCompleteBooking_Click(object sender, EventArgs e)
    {
        if (Page.IsValid)
        {
            try
            {
                Booking booking = new Booking
                {
                    ProductId = (int)ViewState["ProductId"],
                    StartDate = (DateTime)ViewState["StartDate"],
                    EndDate = (DateTime)ViewState["EndDate"],
                    TotalPrice = (decimal)ViewState["TotalPrice"],
                    Status = "Confirmed",
                    CustomerName = txtCustomerName.Text.Trim(),
                    CustomerEmail = txtCustomerEmail.Text.Trim(),
                    CustomerPhone = txtCustomerPhone.Text.Trim(),
                    CustomerAddress = txtCustomerAddress.Text.Trim()
                };

                int bookingId = dataAccess.CreateBooking(booking);
                
                if (bookingId > 0)
                {
                    Response.Redirect($"BookingConfirmation.aspx?id={bookingId}");
                }
                else
                {
                    ((SiteMaster)Master).ShowMessage("Failed to create booking. Please try again.", "danger");
                }
            }
            catch (Exception ex)
            {
                ((SiteMaster)Master).ShowMessage("An error occurred while creating the booking: " + ex.Message, "danger");
            }
        }
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        Response.Redirect("Default.aspx");
    }
}