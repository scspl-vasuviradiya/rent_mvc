using System;
using System.Web.UI;

public partial class CheckAvailability : Page
{
    private DataAccess dataAccess = new DataAccess();
    private Product currentProduct;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            int productId;
            if (int.TryParse(Request.QueryString["id"], out productId))
            {
                LoadProduct(productId);
                
                // Set default dates
                string selectedDate = Request.QueryString["date"];
                if (!string.IsNullOrEmpty(selectedDate))
                {
                    txtStartDate.Text = selectedDate;
                }
                else
                {
                    txtStartDate.Text = DateTime.Today.AddDays(1).ToString("yyyy-MM-dd");
                }
                
                txtEndDate.Text = DateTime.Today.AddDays(2).ToString("yyyy-MM-dd");
                
                CheckAvailabilityAndCalculatePrice();
            }
            else
            {
                Response.Redirect("Default.aspx");
            }
        }
        else
        {
            // Reload product on postback
            int productId;
            if (int.TryParse(Request.QueryString["id"], out productId))
            {
                LoadProduct(productId);
            }
        }
    }

    private void LoadProduct(int productId)
    {
        currentProduct = dataAccess.GetProductById(productId);
        if (currentProduct != null)
        {
            imgProduct.ImageUrl = currentProduct.ImageUrl;
            litProductName.Text = currentProduct.Name;
            litPricePerDay.Text = currentProduct.PricePerDay.ToString("F2");
            litStatusColor.Text = currentProduct.StatusColor;
            litStatus.Text = currentProduct.Status;
            litProductPrice.Text = currentProduct.PricePerDay.ToString("F2");
            litWashingDays.Text = currentProduct.WashingDays.ToString();
            
            // Store product info for calculations
            ViewState["ProductId"] = currentProduct.Id;
            ViewState["PricePerDay"] = currentProduct.PricePerDay;
        }
    }

    protected void DateChanged(object sender, EventArgs e)
    {
        CheckAvailabilityAndCalculatePrice();
    }

    private void CheckAvailabilityAndCalculatePrice()
    {
        if (!string.IsNullOrEmpty(txtStartDate.Text) && !string.IsNullOrEmpty(txtEndDate.Text))
        {
            DateTime startDate, endDate;
            if (DateTime.TryParse(txtStartDate.Text, out startDate) && DateTime.TryParse(txtEndDate.Text, out endDate))
            {
                if (endDate > startDate)
                {
                    // Calculate price
                    int totalDays = (endDate - startDate).Days + 1;
                    decimal pricePerDay = (decimal)ViewState["PricePerDay"];
                    decimal totalPrice = totalDays * pricePerDay;
                    
                    litTotalDays.Text = totalDays.ToString();
                    litPricePerDayCalc.Text = pricePerDay.ToString("F2");
                    litTotalPrice.Text = totalPrice.ToString("F2");
                    pnlPriceCalculation.Visible = true;
                    
                    // Check availability
                    int productId = (int)ViewState["ProductId"];
                    bool isAvailable = dataAccess.IsProductAvailable(productId, startDate, endDate);
                    
                    if (isAvailable)
                    {
                        pnlAvailabilityMessage.CssClass = "alert alert-success";
                        litAvailabilityMessage.Text = "✓ Dates Available - These dates have been verified as available";
                        btnContinueBooking.Enabled = true;
                    }
                    else
                    {
                        pnlAvailabilityMessage.CssClass = "alert alert-danger";
                        litAvailabilityMessage.Text = "✗ Dates Not Available - Please select different dates";
                        btnContinueBooking.Enabled = false;
                    }
                    
                    pnlAvailabilityMessage.Visible = true;
                }
                else
                {
                    pnlPriceCalculation.Visible = false;
                    pnlAvailabilityMessage.Visible = false;
                    btnContinueBooking.Enabled = false;
                }
            }
        }
    }

    protected void btnContinueBooking_Click(object sender, EventArgs e)
    {
        int productId = (int)ViewState["ProductId"];
        string startDate = txtStartDate.Text;
        string endDate = txtEndDate.Text;
        
        Response.Redirect($"CreateBooking.aspx?productId={productId}&startDate={startDate}&endDate={endDate}");
    }
}