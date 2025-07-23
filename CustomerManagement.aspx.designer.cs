using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// CustomerManagement class.
/// </summary>
public partial class CustomerManagement
{
    /// <summary>
    /// litTotalCustomers control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litTotalCustomers;

    /// <summary>
    /// litTotalBookings control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litTotalBookings;

    /// <summary>
    /// litTotalRevenue control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litTotalRevenue;

    /// <summary>
    /// litActiveCustomers control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litActiveCustomers;

    /// <summary>
    /// txtSearchCustomer control.
    /// </summary>
    protected global::System.Web.UI.WebControls.TextBox txtSearchCustomer;

    /// <summary>
    /// ddlSortBy control.
    /// </summary>
    protected global::System.Web.UI.WebControls.DropDownList ddlSortBy;

    /// <summary>
    /// btnSearch control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Button btnSearch;

    /// <summary>
    /// rptCustomers control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Repeater rptCustomers;

    /// <summary>
    /// pnlNoCustomers control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Panel pnlNoCustomers;
}