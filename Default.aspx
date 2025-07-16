<%@ Page Title="Home" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <!-- Product Availability & Status -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-search me-2"></i>Product Availability & Status
                    </h2>
                    <p class="card-text text-muted">Check product availability and status by date with advanced filtering</p>
                    
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label for="txtSelectedDate" class="form-label">
                                <i class="fas fa-calendar me-1"></i>Check Date
                            </label>
                            <asp:TextBox ID="txtSelectedDate" runat="server" CssClass="form-control" TextMode="Date"></asp:TextBox>
                        </div>
                        <div class="col-md-3">
                            <label for="txtSearchTerm" class="form-label">
                                <i class="fas fa-search me-1"></i>Search
                            </label>
                            <asp:TextBox ID="txtSearchTerm" runat="server" CssClass="form-control" placeholder="Search by code or name..."></asp:TextBox>
                        </div>
                        <div class="col-md-2">
                            <label for="ddlFilterCategory" class="form-label">
                                <i class="fas fa-filter me-1"></i>Category
                            </label>
                            <asp:DropDownList ID="ddlFilterCategory" runat="server" CssClass="form-select">
                                <asp:ListItem Value="all" Text="All Categories" Selected="True"></asp:ListItem>
                            </asp:DropDownList>
                        </div>
                        <div class="col-md-2">
                            <label for="ddlFilterStatus" class="form-label">Status</label>
                            <asp:DropDownList ID="ddlFilterStatus" runat="server" CssClass="form-select">
                                <asp:ListItem Value="all" Text="All Status" Selected="True"></asp:ListItem>
                                <asp:ListItem Value="Available" Text="Available"></asp:ListItem>
                                <asp:ListItem Value="Delivered" Text="Delivered"></asp:ListItem>
                                <asp:ListItem Value="Reserved" Text="Reserved"></asp:ListItem>
                                <asp:ListItem Value="Washing" Text="Washing"></asp:ListItem>
                            </asp:DropDownList>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">&nbsp;</label>
                            <asp:Button ID="btnFilter" runat="server" Text="Filter" CssClass="btn btn-primary d-block w-100" OnClick="btnFilter_Click" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Status Legend -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card bg-light">
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-md-3">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <span class="text-muted">Available</span>
                        </div>
                        <div class="col-md-3">
                            <i class="fas fa-truck text-info me-2"></i>
                            <span class="text-muted">Delivered</span>
                        </div>
                        <div class="col-md-3">
                            <i class="fas fa-user text-warning me-2"></i>
                            <span class="text-muted">Reserved</span>
                        </div>
                        <div class="col-md-3">
                            <i class="fas fa-tint text-secondary me-2"></i>
                            <span class="text-muted">In Washing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Products Grid -->
    <div class="row">
        <asp:Repeater ID="rptProducts" runat="server" OnItemCommand="rptProducts_ItemCommand">
            <ItemTemplate>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="position-relative">
                            <img src='<%# Eval("ImageUrl") %>' class="card-img-top" alt='<%# Eval("Name") %>' style="height: 250px; object-fit: cover;">
                            <span class='badge bg-<%# Eval("StatusColor") %> position-absolute top-0 end-0 m-2'>
                                <%# Eval("StatusText") %>
                            </span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title"><%# Eval("Name") %></h5>
                            <p class="text-muted small mb-1">Code: <%# Eval("Code") %></p>
                            <p class="text-muted small mb-2"><%# Eval("Category") %> • <%# Eval("Size") %> • <%# Eval("Color") %></p>
                            <p class="card-text flex-grow-1"><%# Eval("Description") %></p>
                            
                            <div class="row text-center mb-3">
                                <div class="col-6">
                                    <div class="bg-primary bg-opacity-10 p-2 rounded">
                                        <div class="fw-bold text-primary">$<%# Eval("PricePerDay", "{0:F2}") %></div>
                                        <small class="text-muted">Per Day</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="bg-secondary bg-opacity-10 p-2 rounded">
                                        <div class="fw-bold text-secondary"><%# Eval("WashingDays") %></div>
                                        <small class="text-muted">Wash Days</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <asp:LinkButton ID="btnCheckDates" runat="server" 
                                    CssClass="btn btn-primary" 
                                    CommandName="CheckDates" 
                                    CommandArgument='<%# Eval("Id") %>'>
                                    <i class="fas fa-calendar me-1"></i>Check Dates
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnViewDetails" runat="server" 
                                    CssClass="btn btn-outline-secondary" 
                                    CommandName="ViewDetails" 
                                    CommandArgument='<%# Eval("Id") %>'>
                                    <i class="fas fa-info-circle me-1"></i>View Details
                                </asp:LinkButton>
                            </div>
                        </div>
                    </div>
                </div>
            </ItemTemplate>
        </asp:Repeater>
        
        <asp:Panel ID="pnlNoProducts" runat="server" Visible="false" CssClass="col-12">
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h3 class="text-muted">No products found</h3>
                <p class="text-muted">No products match your search criteria.</p>
            </div>
        </asp:Panel>
    </div>

</asp:Content>