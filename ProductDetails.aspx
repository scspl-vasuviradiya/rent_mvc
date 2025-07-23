<%@ Page Title="Product Details" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="ProductDetails.aspx.cs" Inherits="ProductDetails" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="row">
        <div class="col-md-6">
            <div class="card">
                <asp:Image ID="imgProduct" runat="server" CssClass="card-img-top" style="height: 400px; object-fit: cover;" />
                <div class="card-body">
                    <span class='badge bg-<%# Eval("StatusColor") %> mb-2'><asp:Literal ID="litStatus" runat="server"></asp:Literal></span>
                    <h2 class="card-title"><asp:Literal ID="litProductName" runat="server"></asp:Literal></h2>
                    <p class="text-muted mb-2">Code: <asp:Literal ID="litProductCode" runat="server"></asp:Literal></p>
                    <p class="card-text"><asp:Literal ID="litDescription" runat="server"></asp:Literal></p>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Product Information</h5>
                    
                    <div class="row mb-3">
                        <div class="col-sm-4"><strong>Category:</strong></div>
                        <div class="col-sm-8"><asp:Literal ID="litCategory" runat="server"></asp:Literal></div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-sm-4"><strong>Size:</strong></div>
                        <div class="col-sm-8"><asp:Literal ID="litSize" runat="server"></asp:Literal></div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-sm-4"><strong>Color:</strong></div>
                        <div class="col-sm-8"><asp:Literal ID="litColor" runat="server"></asp:Literal></div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-sm-4"><strong>Price per Day:</strong></div>
                        <div class="col-sm-8 text-primary fw-bold fs-4">$<asp:Literal ID="litPricePerDay" runat="server"></asp:Literal></div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-sm-4"><strong>Washing Time:</strong></div>
                        <div class="col-sm-8"><asp:Literal ID="litWashingDays" runat="server"></asp:Literal> days</div>
                    </div>
                    
                    <div class="row mb-4">
                        <div class="col-sm-4"><strong>Status:</strong></div>
                        <div class="col-sm-8">
                            <span class='badge bg-<%# Eval("StatusColor") %>'><asp:Literal ID="litCurrentStatus" runat="server"></asp:Literal></span>
                        </div>
                    </div>
                    
                    <div class="d-grid gap-2">
                        <asp:Button ID="btnCheckAvailability" runat="server" Text="Check Availability" CssClass="btn btn-primary btn-lg" OnClick="btnCheckAvailability_Click" />
                        <asp:Button ID="btnBackToProducts" runat="server" Text="Back to Products" CssClass="btn btn-outline-secondary" OnClick="btnBackToProducts_Click" />
                    </div>
                </div>
            </div>
            
            <!-- Booking History for this Product -->
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-history me-2"></i>Booking History
                    </h5>
                </div>
                <div class="card-body">
                    <asp:Repeater ID="rptBookingHistory" runat="server">
                        <ItemTemplate>
                            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                                <div>
                                    <div class="fw-bold"><%# Eval("CustomerName") %></div>
                                    <small class="text-muted"><%# Eval("StartDate", "{0:MMM dd}") %> - <%# Eval("EndDate", "{0:MMM dd, yyyy}") %></small>
                                </div>
                                <div class="text-end">
                                    <div class="fw-bold text-success">$<%# Eval("TotalPrice", "{0:F2}") %></div>
                                    <span class='badge bg-<%# Eval("StatusColor") %>'><%# Eval("Status") %></span>
                                </div>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>
                    
                    <asp:Panel ID="pnlNoBookings" runat="server" Visible="false" CssClass="text-center py-3">
                        <i class="fas fa-calendar fa-2x text-muted mb-2"></i>
                        <p class="text-muted mb-0">No booking history for this product.</p>
                    </asp:Panel>
                </div>
            </div>
        </div>
    </div>

</asp:Content>