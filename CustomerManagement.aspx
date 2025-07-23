<%@ Page Title="Customer Management" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="CustomerManagement.aspx.cs" Inherits="CustomerManagement" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
            <i class="fas fa-users me-2"></i>Customer Management
        </h2>
    </div>

    <!-- Customer Statistics -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card bg-primary text-white">
                <div class="card-body text-center">
                    <i class="fas fa-users fa-2x mb-2"></i>
                    <h4><asp:Literal ID="litTotalCustomers" runat="server"></asp:Literal></h4>
                    <small>Total Customers</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-success text-white">
                <div class="card-body text-center">
                    <i class="fas fa-calendar fa-2x mb-2"></i>
                    <h4><asp:Literal ID="litTotalBookings" runat="server"></asp:Literal></h4>
                    <small>Total Bookings</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-info text-white">
                <div class="card-body text-center">
                    <i class="fas fa-dollar-sign fa-2x mb-2"></i>
                    <h4>$<asp:Literal ID="litTotalRevenue" runat="server"></asp:Literal></h4>
                    <small>Total Revenue</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-warning text-white">
                <div class="card-body text-center">
                    <i class="fas fa-user-check fa-2x mb-2"></i>
                    <h4><asp:Literal ID="litActiveCustomers" runat="server"></asp:Literal></h4>
                    <small>Active Customers</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-4">
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="txtSearchCustomer" class="form-label">Search Customers</label>
                    <asp:TextBox ID="txtSearchCustomer" runat="server" CssClass="form-control" placeholder="Search by name or email..."></asp:TextBox>
                </div>
                <div class="col-md-3">
                    <label for="ddlSortBy" class="form-label">Sort By</label>
                    <asp:DropDownList ID="ddlSortBy" runat="server" CssClass="form-select">
                        <asp:ListItem Value="name" Text="Name" Selected="True"></asp:ListItem>
                        <asp:ListItem Value="bookings" Text="Total Bookings"></asp:ListItem>
                        <asp:ListItem Value="revenue" Text="Total Spent"></asp:ListItem>
                        <asp:ListItem Value="recent" Text="Most Recent"></asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="col-md-3">
                    <label class="form-label">&nbsp;</label>
                    <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-primary d-block w-100" OnClick="btnSearch_Click" />
                </div>
            </div>
        </div>
    </div>

    <!-- Customer List -->
    <div class="row">
        <asp:Repeater ID="rptCustomers" runat="server" OnItemCommand="rptCustomers_ItemCommand">
            <ItemTemplate>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div>
                                    <h5 class="card-title mb-1"><%# Eval("CustomerName") %></h5>
                                    <small class="text-muted"><%# Eval("CustomerEmail") %></small>
                                </div>
                            </div>
                            
                            <div class="row text-center mb-3">
                                <div class="col-4">
                                    <div class="bg-light p-2 rounded">
                                        <div class="fw-bold text-primary"><%# Eval("TotalBookings") %></div>
                                        <small class="text-muted">Bookings</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="bg-light p-2 rounded">
                                        <div class="fw-bold text-success">$<%# Eval("TotalSpent", "{0:F2}") %></div>
                                        <small class="text-muted">Spent</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="bg-light p-2 rounded">
                                        <div class="fw-bold text-info"><%# Eval("LastBookingDays") %></div>
                                        <small class="text-muted">Days Ago</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <small class="text-muted">Contact:</small>
                                <div class="small">
                                    <i class="fas fa-phone me-1"></i><%# Eval("CustomerPhone") %><br>
                                    <i class="fas fa-map-marker-alt me-1"></i><%# Eval("CustomerAddress") %>
                                </div>
                            </div>
                            
                            <div class="d-grid">
                                <asp:LinkButton ID="btnViewCustomer" runat="server" 
                                    CssClass="btn btn-outline-primary" 
                                    CommandName="ViewCustomer" 
                                    CommandArgument='<%# Eval("CustomerEmail") %>'>
                                    <i class="fas fa-eye me-1"></i>View Details
                                </asp:LinkButton>
                            </div>
                        </div>
                    </div>
                </div>
            </ItemTemplate>
        </asp:Repeater>
        
        <asp:Panel ID="pnlNoCustomers" runat="server" Visible="false" CssClass="col-12">
            <div class="text-center py-5">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h3 class="text-muted">No customers found</h3>
                <p class="text-muted">Customers will appear here once bookings are made.</p>
            </div>
        </asp:Panel>
    </div>

</asp:Content>