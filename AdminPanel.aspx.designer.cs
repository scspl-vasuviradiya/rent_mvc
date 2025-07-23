using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// AdminPanel class.
/// </summary>
public partial class AdminPanel
{
    /// <summary>
    /// litTotalProducts control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litTotalProducts;

    /// <summary>
    /// litTotalRevenue control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litTotalRevenue;

    /// <summary>
    /// litActiveBookings control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litActiveBookings;

    /// <summary>
    /// litAvailableProducts control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Literal litAvailableProducts;

    /// <summary>
    /// btnToggleAddForm control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Button btnToggleAddForm;

    /// <summary>
    /// pnlAddProduct control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Panel pnlAddProduct;

    /// <summary>
    /// txtProductCode control.
    /// </summary>
    protected global::System.Web.UI.WebControls.TextBox txtProductCode;

    /// <summary>
    /// rfvProductCode control.
    /// </summary>
    protected global::System.Web.UI.WebControls.RequiredFieldValidator rfvProductCode;

    /// <summary>
    /// txtProductName control.
    /// </summary>
    protected global::System.Web.UI.WebControls.TextBox txtProductName;

    /// <summary>
    /// rfvProductName control.
    /// </summary>
    protected global::System.Web.UI.WebControls.RequiredFieldValidator rfvProductName;

    /// <summary>
    /// txtDescription control.
    /// </summary>
    protected global::System.Web.UI.WebControls.TextBox txtDescription;

    /// <summary>
    /// txtImageUrl control.
    /// </summary>
    protected global::System.Web.UI.WebControls.TextBox txtImageUrl;

    /// <summary>
    /// txtPricePerDay control.
    /// </summary>
    protected global::System.Web.UI.WebControls.TextBox txtPricePerDay;

    /// <summary>
    /// rfvPricePerDay control.
    /// </summary>
    protected global::System.Web.UI.WebControls.RequiredFieldValidator rfvPricePerDay;

    /// <summary>
    /// ddlCategory control.
    /// </summary>
    protected global::System.Web.UI.WebControls.DropDownList ddlCategory;

    /// <summary>
    /// rfvCategory control.
    /// </summary>
    protected global::System.Web.UI.WebControls.RequiredFieldValidator rfvCategory;

    /// <summary>
    /// ddlSize control.
    /// </summary>
    protected global::System.Web.UI.WebControls.DropDownList ddlSize;

    /// <summary>
    /// ddlColor control.
    /// </summary>
    protected global::System.Web.UI.WebControls.DropDownList ddlColor;

    /// <summary>
    /// txtWashingDays control.
    /// </summary>
    protected global::System.Web.UI.WebControls.TextBox txtWashingDays;

    /// <summary>
    /// btnAddProduct control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Button btnAddProduct;

    /// <summary>
    /// btnCancelAdd control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Button btnCancelAdd;

    /// <summary>
    /// rptRecentBookings control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Repeater rptRecentBookings;

    /// <summary>
    /// pnlNoRecentBookings control.
    /// </summary>
    protected global::System.Web.UI.WebControls.Panel pnlNoRecentBookings;
}