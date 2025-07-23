<%@ Page Title="Customer Details" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="CustomerDetails.aspx.cs" Inherits="CustomerDetails" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
            <i class="fas fa-user me-2"></i>Customer Details
        </h2>
        <asp:Button ID="btnBackToCustomers" runat="server" Text="Back to Customers" CssClass="btn btn-outline-secondary" OnClick="btnBackToCustomers_Click" />
    </div>

    <div class="row">
        <div class="col-md-4">
            <!-- Customer Info Card -->
            <div class="card">
                <div class="card-body text-center">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 80px; height: 80px;">
                        <i class="fas fa-user fa-2x"></i>
                    </div>
                    <h4><asp:Literal ID="litCustomerName" runat="server"></asp:Literal></h4>
                    <p class="text-muted"><asp:Literal ID="litCustomerEmail" runat="server"></asp:Literal></p>
                    
                    <div class="row text-center mb-3">
                        <div class="col-4">
                            <div class="bg-light p-2 rounded">
                                <div class="fw-bold text-primary"><asp:Literal ID="litTotalBookings" runat="server"></asp:Literal></div>
                                <small class="text-muted">Bookings</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="bg-light p-2 rounded">
                                <div class="fw-bold text-success">$<asp:Literal ID="litTotalSpent" runat="server"></asp:Literal></div>
                                <small class="text-muted">Spent</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="bg-light p-2 rounded">
                                <div class="fw-bold text-info"><asp:Literal ID="litAvgBookingValue" runat="server"></asp:Literal></div>
                                <small class="text-muted">Avg Value</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Contact Information -->
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="mb-0">Contact Information</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <i class="fas fa-envelope text-muted me-2"></i>
                        <strong>Email:</strong><br>
                        <asp:Literal ID="litEmailAddress" runat="server"></asp:Literal>
                    </div>
                    <div class="mb-3">
                        <i class="fas fa-phone text-muted me-2"></i>
                        <strong>Phone:</strong><br>
                        <asp:Literal ID="litPhoneNumber" runat="server"></asp:Literal>
                    </div>
                    <div class="mb-0">
                        <i class="fas fa-map-marker-alt text-muted me-2"></i>
                        <strong>Address:</strong><br>
                        <asp:Literal ID="litAddress" runat="server"></asp:Literal>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-8">
            <!-- Booking History -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-history me-2"></i>Booking History
                    </h5>
                </div>
                <div class="card-body">
                    <asp:Repeater ID="rptBookingHistory" runat="server">
                        <ItemTemplate>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-2">
                                            <img src='<%# Eval("ProductImageUrl") %>' alt='<%# Eval("ProductName") %>' class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                                        </div>
                                        <div class="col-md-4">
                                            <h6 class="mb-1"><%# Eval("ProductName") %></h6>
                                            <p class="text-muted mb-1">Code: <%# Eval("ProductCode") %></p>
                                            <small class="text-muted">Booking #<%# Eval("Id") %></small>
                                        </div>
                                        <div class="col-md-3">
                                            <small class="text-muted">Rental Period</small>
                                            <div class="fw-bold"><%# Eval("StartDate", "{0:MMM dd}") %> - <%# Eval("EndDate", "{0:MMM dd, yyyy}") %></div>
                                            <small class="text-muted"><%# Eval("TotalDays") %> days</small>
                                        </div>
                                        <div class="col-md-2">
                                            <small class="text-muted">Total</small>
                                            <div class="fw-bold text-success">$<%# Eval("TotalPrice", "{0:F2}") %></div>
                                        </div>
                                        <div class="col-md-1">
                                            <span class='badge bg-<%# Eval("StatusColor") %>'><%# Eval("Status") %></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>
                    
                    <asp:Panel ID="pnlNoBookings" runat="server" Visible="false" CssClass="text-center py-4">
                        <i class="fas fa-calendar fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">No booking history</h5>
                        <p class="text-muted">This customer hasn't made any bookings yet.</p>
                    </asp:Panel>
                </div>
            </div>
        </div>
    </div>

</asp:Content>