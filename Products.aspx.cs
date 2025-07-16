using System;
using System.Collections.Generic;
using System.Web.UI;

public partial class Products : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadCategories();
            LoadProducts();
        }
    }

    private void LoadCategories()
    {
        List<string> categories = dataAccess.GetCategories();
        
        ddlFilterCategory.Items.Clear();
        ddlFilterCategory.Items.Add(new System.Web.UI.WebControls.ListItem("All Categories", "all"));
        
        foreach (string category in categories)
        {
            ddlFilterCategory.Items.Add(new System.Web.UI.WebControls.ListItem(category, category));
        }
    }

    private void LoadProducts()
    {
        string searchTerm = txtSearchTerm.Text.Trim();
        string category = ddlFilterCategory.SelectedValue;
        string status = ddlFilterStatus.SelectedValue;

        List<Product> products = dataAccess.GetProducts(searchTerm, category, status);
        
        gvProducts.DataSource = products;
        gvProducts.DataBind();
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        LoadProducts();
    }
}