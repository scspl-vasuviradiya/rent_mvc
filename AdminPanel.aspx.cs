using System;
using System.Collections.Generic;
using System.Web.UI;

public partial class AdminPanel : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadDashboardStats();
            LoadRecentBookings();
        }
    }

    private void LoadDashboardStats()
    {
        try
        {
            List<Product> products = dataAccess.GetProducts();
            List<Booking> bookings = dataAccess.GetBookings();

            litTotalProducts.Text = products.Count.ToString();
            litAvailableProducts.Text = products.FindAll(p => p.Status.ToLower() == "available").Count.ToString();
            litActiveBookings.Text = bookings.FindAll(b => b.Status.ToLower() == "active" || b.Status.ToLower() == "delivered").Count.ToString();

            decimal totalRevenue = 0;
            foreach (Booking booking in bookings)
            {
                if (booking.Status.ToLower() != "cancelled")
                {
                    totalRevenue += booking.TotalPrice;
                }
            }
            litTotalRevenue.Text = totalRevenue.ToString("F2");
        }
        catch (Exception ex)
        {
            ((SiteMaster)Master).ShowMessage("Error loading dashboard statistics: " + ex.Message, "danger");
        }
    }

    private void LoadRecentBookings()
    {
        try
        {
            List<Booking> recentBookings = dataAccess.GetBookings();
            
            // Get only the 5 most recent bookings
            if (recentBookings.Count > 5)
            {
                recentBookings = recentBookings.GetRange(0, 5);
            }

            if (recentBookings.Count > 0)
            {
                rptRecentBookings.DataSource = recentBookings;
                rptRecentBookings.DataBind();
                rptRecentBookings.Visible = true;
                pnlNoRecentBookings.Visible = false;
            }
            else
            {
                rptRecentBookings.Visible = false;
                pnlNoRecentBookings.Visible = true;
            }
        }
        catch (Exception ex)
        {
            ((SiteMaster)Master).ShowMessage("Error loading recent bookings: " + ex.Message, "danger");
        }
    }

    protected void btnToggleAddForm_Click(object sender, EventArgs e)
    {
        pnlAddProduct.Visible = !pnlAddProduct.Visible;
        btnToggleAddForm.Text = pnlAddProduct.Visible ? "Hide Form" : "Add Product";
    }

    protected void btnAddProduct_Click(object sender, EventArgs e)
    {
        if (Page.IsValid)
        {
            try
            {
                Product newProduct = new Product
                {
                    Code = txtProductCode.Text.Trim(),
                    Name = txtProductName.Text.Trim(),
                    Description = txtDescription.Text.Trim(),
                    ImageUrl = string.IsNullOrEmpty(txtImageUrl.Text.Trim()) ? 
                        "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400" : 
                        txtImageUrl.Text.Trim(),
                    PricePerDay = decimal.Parse(txtPricePerDay.Text),
                    Category = ddlCategory.SelectedValue,
                    Size = ddlSize.SelectedValue,
                    Color = ddlColor.SelectedValue,
                    Status = "Available",
                    WashingDays = int.Parse(txtWashingDays.Text)
                };

                bool success = dataAccess.AddProduct(newProduct);
                
                if (success)
                {
                    ((SiteMaster)Master).ShowMessage("Product added successfully!", "success");
                    ClearAddProductForm();
                    pnlAddProduct.Visible = false;
                    btnToggleAddForm.Text = "Add Product";
                    LoadDashboardStats(); // Refresh stats
                }
                else
                {
                    ((SiteMaster)Master).ShowMessage("Failed to add product. Please try again.", "danger");
                }
            }
            catch (Exception ex)
            {
                ((SiteMaster)Master).ShowMessage("Error adding product: " + ex.Message, "danger");
            }
        }
    }

    protected void btnCancelAdd_Click(object sender, EventArgs e)
    {
        ClearAddProductForm();
        pnlAddProduct.Visible = false;
        btnToggleAddForm.Text = "Add Product";
    }

    private void ClearAddProductForm()
    {
        txtProductCode.Text = "";
        txtProductName.Text = "";
        txtDescription.Text = "";
        txtImageUrl.Text = "";
        txtPricePerDay.Text = "";
        ddlCategory.SelectedIndex = 0;
        ddlSize.SelectedValue = "M";
        ddlColor.SelectedValue = "Black";
        txtWashingDays.Text = "2";
    }
}