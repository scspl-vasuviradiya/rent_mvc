<%@ Page Title="All Bookings" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Bookings.aspx.cs" Inherits="Bookings" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
            <i class="fas fa-calendar me-2"></i>All Bookings
        </h2>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-3">
                    <label for="ddlFilterStatus" class="form-label">Status</label>
                    <asp:DropDownList ID="ddlFilterStatus" runat="server" CssClass="form-select">
                        <asp:ListItem Value="all" Text="All Status" Selected="True"></asp:ListItem>
                        <asp:ListItem Value="Confirmed" Text="Confirmed"></asp:ListItem>
                        <asp:ListItem Value="Delivered" Text="Delivered"></asp:ListItem>
                        <asp:ListItem Value="Active" Text="Active"></asp:ListItem>
                        <asp:ListItem Value="Returned" Text="Returned"></asp:ListItem>
                        <asp:ListItem Value="Washing" Text="Washing"></asp:ListItem>
                        <asp:ListItem Value="Completed" Text="Completed"></asp:ListItem>
                        <asp:ListItem Value="Cancelled" Text="Cancelled"></asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="col-md-3">
                    <label class="form-label">&nbsp;</label>
                    <asp:Button ID="btnFilter" runat="server" Text="Filter" CssClass="btn btn-primary d-block w-100" OnClick="btnFilter_Click" />
                </div>
            </div>
        </div>
    </div>

    <!-- Bookings List -->
    <asp:Repeater ID="rptBookings" runat="server">
        <ItemTemplate>
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src='<%# Eval("ProductImageUrl") %>' alt='<%# Eval("ProductName") %>' class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                        </div>
                        <div class="col-md-3">
                            <h6 class="mb-1"><%# Eval("ProductName") %></h6>
                            <p class="text-muted mb-1">Code: <%# Eval("ProductCode") %></p>
                            <p class="text-muted mb-0">Booking #<%# Eval("Id") %></p>
                        </div>
                        <div class="col-md-2">
                            <small class="text-muted">Customer</small>
                            <div class="fw-bold"><%# Eval("CustomerName") %></div>
                            <small class="text-muted"><%# Eval("CustomerEmail") %></small>
                        </div>
                        <div class="col-md-2">
                            <small class="text-muted">Rental Period</small>
                            <div class="fw-bold"><%# Eval("StartDate", "{0:MMM dd}") %> - <%# Eval("EndDate", "{0:MMM dd}") %></div>
                        </div>
                        <div class="col-md-1">
                            <small class="text-muted">Total</small>
                            <div class="fw-bold text-primary">$<%# Eval("TotalPrice", "{0:F2}") %></div>
                        </div>
                        <div class="col-md-2">
                            <span class='badge bg-<%# Eval("StatusColor") %>'><%# Eval("Status") %></span>
                        </div>
                    </div>
                </div>
            </div>
        </ItemTemplate>
    </asp:Repeater>
    
    <asp:Panel ID="pnlNoBookings" runat="server" Visible="false">
        <div class="text-center py-5">
            <i class="fas fa-calendar fa-3x text-muted mb-3"></i>
            <h3 class="text-muted">No bookings found</h3>
            <p class="text-muted">Bookings will appear here once customers make reservations.</p>
        </div>
    </asp:Panel>

</asp:Content>