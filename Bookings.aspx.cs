using System;
using System.Collections.Generic;
using System.Web.UI;

public partial class Bookings : Page
{
    private DataAccess dataAccess = new DataAccess();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadBookings();
        }
    }

    private void LoadBookings()
    {
        string status = ddlFilterStatus.SelectedValue;
        List<Booking> bookings = dataAccess.GetBookings(status);
        
        if (bookings.Count > 0)
        {
            rptBookings.DataSource = bookings;
            rptBookings.DataBind();
            rptBookings.Visible = true;
            pnlNoBookings.Visible = false;
        }
        else
        {
            rptBookings.Visible = false;
            pnlNoBookings.Visible = true;
        }
    }

    protected void btnFilter_Click(object sender, EventArgs e)
    {
        LoadBookings();
    }
}