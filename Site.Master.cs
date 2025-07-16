using System;
using System.Web.UI;

public partial class SiteMaster : MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
    }

    public void ShowMessage(string message, string type = "success")
    {
        pnlMessages.Visible = true;
        pnlMessages.CssClass = $"alert alert-{type} alert-dismissible fade show";
        litMessage.Text = message;
    }
}