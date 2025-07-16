using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            txtSelectedDate.Text = DateTime.Today.ToString("yyyy-MM-dd");
            LoadCategories();
            LoadProducts();
        }
    }

    private void LoadCategories()
    {
        List<string> categories = dataAccess.GetCategories();
        
        ddlFilterCategory.Items.Clear();
        ddlFilterCategory.Items.Add(new ListItem("All Categories", "all"));
        
        foreach (string category in categories)
        {
            ddlFilterCategory.Items.Add(new ListItem(category, category));
        }
    }

    private void LoadProducts()
    {
        string searchTerm = txtSearchTerm.Text.Trim();
        string category = ddlFilterCategory.SelectedValue;
        string status = ddlFilterStatus.SelectedValue;

        List<Product> products = dataAccess.GetProducts(searchTerm, category, status);
        
        if (products.Count > 0)
        {
            rptProducts.DataSource = products;
            rptProducts.DataBind();
            rptProducts.Visible = true;
            pnlNoProducts.Visible = false;
        }
        else
        {
            rptProducts.Visible = false;
            pnlNoProducts.Visible = true;
        }
    }

    protected void btnFilter_Click(object sender, EventArgs e)
    {
        LoadProducts();
    }

    protected void rptProducts_ItemCommand(object source, RepeaterCommandEventArgs e)
    {
        int productId = Convert.ToInt32(e.CommandArgument);
        
        if (e.CommandName == "CheckDates")
        {
            Response.Redirect($"CheckAvailability.aspx?id={productId}&date={txtSelectedDate.Text}");
        }
        else if (e.CommandName == "ViewDetails")
        {
            Response.Redirect($"ProductDetails.aspx?id={productId}");
        }
    }
}