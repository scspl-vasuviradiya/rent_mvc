<%@ Page Title="Admin Panel" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="AdminPanel.aspx.cs" Inherits="AdminPanel" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
            <i class="fas fa-cog me-2"></i>Admin Panel
        </h2>
    </div>

    <!-- Statistics Dashboard -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card bg-primary text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-tshirt fa-2x me-3"></i>
                        <div>
                            <h4 class="mb-0"><asp:Literal ID="litTotalProducts" runat="server"></asp:Literal></h4>
                            <small>Total Products</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-success text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-dollar-sign fa-2x me-3"></i>
                        <div>
                            <h4 class="mb-0">$<asp:Literal ID="litTotalRevenue" runat="server"></asp:Literal></h4>
                            <small>Total Revenue</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-info text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-calendar fa-2x me-3"></i>
                        <div>
                            <h4 class="mb-0"><asp:Literal ID="litActiveBookings" runat="server"></asp:Literal></h4>
                            <small>Active Bookings</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-warning text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-check-circle fa-2x me-3"></i>
                        <div>
                            <h4 class="mb-0"><asp:Literal ID="litAvailableProducts" runat="server"></asp:Literal></h4>
                            <small>Available Items</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Product Management Section -->
    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
                <i class="fas fa-plus me-2"></i>Add New Product
            </h5>
            <asp:Button ID="btnToggleAddForm" runat="server" Text="Add Product" CssClass="btn btn-primary btn-sm" OnClick="btnToggleAddForm_Click" />
        </div>
        <asp:Panel ID="pnlAddProduct" runat="server" CssClass="card-body" Visible="false">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="txtProductCode" class="form-label">Product Code</label>
                        <asp:TextBox ID="txtProductCode" runat="server" CssClass="form-control" placeholder="e.g., ED-001"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvProductCode" runat="server" ControlToValidate="txtProductCode" ErrorMessage="Product code is required" CssClass="text-danger" Display="Dynamic" ValidationGroup="AddProduct"></asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="mb-3">
                        <label for="txtProductName" class="form-label">Product Name</label>
                        <asp:TextBox ID="txtProductName" runat="server" CssClass="form-control"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvProductName" runat="server" ControlToValidate="txtProductName" ErrorMessage="Product name is required" CssClass="text-danger" Display="Dynamic" ValidationGroup="AddProduct"></asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="mb-3">
                        <label for="txtDescription" class="form-label">Description</label>
                        <asp:TextBox ID="txtDescription" runat="server" CssClass="form-control" TextMode="MultiLine" Rows="3"></asp:TextBox>
                    </div>
                    
                    <div class="mb-3">
                        <label for="txtImageUrl" class="form-label">Image URL</label>
                        <asp:TextBox ID="txtImageUrl" runat="server" CssClass="form-control" placeholder="https://example.com/image.jpg"></asp:TextBox>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="txtPricePerDay" class="form-label">Price per Day ($)</label>
                        <asp:TextBox ID="txtPricePerDay" runat="server" CssClass="form-control" TextMode="Number" step="0.01"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvPricePerDay" runat="server" ControlToValidate="txtPricePerDay" ErrorMessage="Price is required" CssClass="text-danger" Display="Dynamic" ValidationGroup="AddProduct"></asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="mb-3">
                        <label for="ddlCategory" class="form-label">Category</label>
                        <asp:DropDownList ID="ddlCategory" runat="server" CssClass="form-select">
                            <asp:ListItem Value="">Select Category</asp:ListItem>
                            <asp:ListItem Value="Formal">Formal</asp:ListItem>
                            <asp:ListItem Value="Cocktail">Cocktail</asp:ListItem>
                            <asp:ListItem Value="Wedding">Wedding</asp:ListItem>
                            <asp:ListItem Value="Business">Business</asp:ListItem>
                            <asp:ListItem Value="Casual">Casual</asp:ListItem>
                            <asp:ListItem Value="Party">Party</asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfvCategory" runat="server" ControlToValidate="ddlCategory" ErrorMessage="Category is required" CssClass="text-danger" Display="Dynamic" ValidationGroup="AddProduct"></asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="mb-3">
                        <label for="ddlSize" class="form-label">Size</label>
                        <asp:DropDownList ID="ddlSize" runat="server" CssClass="form-select">
                            <asp:ListItem Value="XS">XS</asp:ListItem>
                            <asp:ListItem Value="S">S</asp:ListItem>
                            <asp:ListItem Value="M" Selected="True">M</asp:ListItem>
                            <asp:ListItem Value="L">L</asp:ListItem>
                            <asp:ListItem Value="XL">XL</asp:ListItem>
                            <asp:ListItem Value="XXL">XXL</asp:ListItem>
                        </asp:DropDownList>
                    </div>
                    
                    <div class="mb-3">
                        <label for="ddlColor" class="form-label">Color</label>
                        <asp:DropDownList ID="ddlColor" runat="server" CssClass="form-select">
                            <asp:ListItem Value="Black" Selected="True">Black</asp:ListItem>
                            <asp:ListItem Value="White">White</asp:ListItem>
                            <asp:ListItem Value="Red">Red</asp:ListItem>
                            <asp:ListItem Value="Blue">Blue</asp:ListItem>
                            <asp:ListItem Value="Green">Green</asp:ListItem>
                            <asp:ListItem Value="Purple">Purple</asp:ListItem>
                            <asp:ListItem Value="Pink">Pink</asp:ListItem>
                            <asp:ListItem Value="Yellow">Yellow</asp:ListItem>
                            <asp:ListItem Value="Gray">Gray</asp:ListItem>
                            <asp:ListItem Value="Brown">Brown</asp:ListItem>
                        </asp:DropDownList>
                    </div>
                    
                    <div class="mb-3">
                        <label for="txtWashingDays" class="form-label">Washing Days</label>
                        <asp:TextBox ID="txtWashingDays" runat="server" CssClass="form-control" TextMode="Number" Text="2"></asp:TextBox>
                    </div>
                </div>
            </div>
            
            <div class="d-flex gap-2">
                <asp:Button ID="btnAddProduct" runat="server" Text="Add Product" CssClass="btn btn-success" OnClick="btnAddProduct_Click" ValidationGroup="AddProduct" />
                <asp:Button ID="btnCancelAdd" runat="server" Text="Cancel" CssClass="btn btn-secondary" OnClick="btnCancelAdd_Click" CausesValidation="false" />
            </div>
        </asp:Panel>
    </div>

    <!-- Recent Bookings -->
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">
                <i class="fas fa-clock me-2"></i>Recent Bookings
            </h5>
        </div>
        <div class="card-body">
            <asp:Repeater ID="rptRecentBookings" runat="server">
                <ItemTemplate>
                    <div class="d-flex align-items-center justify-content-between border-bottom py-3">
                        <div class="d-flex align-items-center">
                            <img src='<%# Eval("ProductImageUrl") %>' alt='<%# Eval("ProductName") %>' class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                            <div>
                                <h6 class="mb-1"><%# Eval("ProductName") %></h6>
                                <small class="text-muted"><%# Eval("CustomerName") %> • <%# Eval("CreatedAt", "{0:MMM dd, yyyy}") %></small>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold text-success">$<%# Eval("TotalPrice", "{0:F2}") %></div>
                            <span class='badge bg-<%# Eval("StatusColor") %>'><%# Eval("Status") %></span>
                        </div>
                    </div>
                </ItemTemplate>
            </asp:Repeater>
            
            <asp:Panel ID="pnlNoRecentBookings" runat="server" Visible="false" CssClass="text-center py-4">
                <i class="fas fa-calendar fa-3x text-muted mb-3"></i>
                <p class="text-muted">No recent bookings found.</p>
            </asp:Panel>
        </div>
    </div>

</asp:Content>