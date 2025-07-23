using System;
using System.Collections.Generic;
using System.Web.UI;

public partial class ProductDetails : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            int productId;
            if (int.TryParse(Request.QueryString["id"], out productId))
            {
                LoadProductDetails(productId);
                LoadBookingHistory(productId);
            }
            else
            {
                Response.Redirect("Default.aspx");
            }
        }
    }

    private void LoadProductDetails(int productId)
    {
        try
        {
            Product product = dataAccess.GetProductById(productId);
            if (product != null)
            {
                // Store product ID for other operations
                ViewState["ProductId"] = productId;
                
                // Populate product details
                imgProduct.ImageUrl = product.ImageUrl;
                litProductName.Text = product.Name;
                litProductCode.Text = product.Code;
                litDescription.Text = product.Description;
                litCategory.Text = product.Category;
                litSize.Text = product.Size;
                litColor.Text = product.Color;
                litPricePerDay.Text = product.PricePerDay.ToString("F2");
                litWashingDays.Text = product.WashingDays.ToString();
                litStatus.Text = product.Status;
                litCurrentStatus.Text = product.Status;
                
                // Set page title
                Page.Title = product.Name + " - Product Details";
                
                // Disable booking button if not available
                if (product.Status.ToLower() != "available")
                {
                    btnCheckAvailability.Text = "Currently Unavailable";
                    btnCheckAvailability.Enabled = false;
                    btnCheckAvailability.CssClass = "btn btn-secondary btn-lg";
                }
            }
            else
            {
                ((SiteMaster)Master).ShowMessage("Product not found.", "danger");
                Response.Redirect("Default.aspx");
            }
        }
        catch (Exception ex)
        {
            ((SiteMaster)Master).ShowMessage("Error loading product details: " + ex.Message, "danger");
        }
    }

    private void LoadBookingHistory(int productId)
    {
        try
        {
            List<Booking> bookings = dataAccess.GetBookingsByProductId(productId);
            
            if (bookings.Count > 0)
            {
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

    protected void btnCheckAvailability_Click(object sender, EventArgs e)
    {
        int productId = (int)ViewState["ProductId"];
        Response.Redirect($"CheckAvailability.aspx?id={productId}");
    }

    protected void btnBackToProducts_Click(object sender, EventArgs e)
    {
        Response.Redirect("Default.aspx");
    }
}