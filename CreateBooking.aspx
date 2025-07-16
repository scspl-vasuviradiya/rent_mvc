<%@ Page Title="Complete Booking" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="CreateBooking.aspx.cs" Inherits="CreateBooking" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <h2 class="mb-0">
                        <i class="fas fa-calendar-check me-2"></i>Complete Booking
                    </h2>
                </div>
                <div class="card-body">
                    <!-- Booking Summary -->
                    <div class="bg-light p-4 rounded mb-4">
                        <h5 class="mb-3">Booking Summary</h5>
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle me-2"></i>
                            <strong>Dates Available</strong> - These dates have been verified as available
                        </div>
                        
                        <div class="d-flex align-items-center mb-3">
                            <asp:Image ID="imgProduct" runat="server" CssClass="rounded me-3" Width="80" Height="80" style="object-fit: cover;" />
                            <div>
                                <h6 class="mb-1"><asp:Literal ID="litProductName" runat="server"></asp:Literal></h6>
                                <p class="text-muted mb-0">Code: <asp:Literal ID="litProductCode" runat="server"></asp:Literal></p>
                            </div>
                        </div>
                        
                        <div class="row text-center">
                            <div class="col-md-3">
                                <small class="text-muted">Start Date</small>
                                <div class="fw-bold"><asp:Literal ID="litStartDate" runat="server"></asp:Literal></div>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">End Date</small>
                                <div class="fw-bold"><asp:Literal ID="litEndDate" runat="server"></asp:Literal></div>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">Duration</small>
                                <div class="fw-bold"><asp:Literal ID="litTotalDays" runat="server"></asp:Literal> days</div>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">Total Price</small>
                                <div class="fw-bold text-primary">$<asp:Literal ID="litTotalPrice" runat="server"></asp:Literal></div>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Details Form -->
                    <h5 class="mb-3">Your Details</h5>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="txtCustomerName" class="form-label">
                                <i class="fas fa-user me-1"></i>Full Name
                            </label>
                            <asp:TextBox ID="txtCustomerName" runat="server" CssClass="form-control"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvCustomerName" runat="server" ControlToValidate="txtCustomerName" ErrorMessage="Full name is required" CssClass="text-danger" Display="Dynamic"></asp:RequiredFieldValidator>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="txtCustomerEmail" class="form-label">
                                <i class="fas fa-envelope me-1"></i>Email Address
                            </label>
                            <asp:TextBox ID="txtCustomerEmail" runat="server" CssClass="form-control" TextMode="Email"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvCustomerEmail" runat="server" ControlToValidate="txtCustomerEmail" ErrorMessage="Email is required" CssClass="text-danger" Display="Dynamic"></asp:RequiredFieldValidator>
                            <asp:RegularExpressionValidator ID="revCustomerEmail" runat="server" ControlToValidate="txtCustomerEmail" ErrorMessage="Invalid email format" ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" CssClass="text-danger" Display="Dynamic"></asp:RegularExpressionValidator>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="txtCustomerPhone" class="form-label">
                                <i class="fas fa-phone me-1"></i>Phone Number
                            </label>
                            <asp:TextBox ID="txtCustomerPhone" runat="server" CssClass="form-control"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvCustomerPhone" runat="server" ControlToValidate="txtCustomerPhone" ErrorMessage="Phone number is required" CssClass="text-danger" Display="Dynamic"></asp:RequiredFieldValidator>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="txtCustomerAddress" class="form-label">
                                <i class="fas fa-map-marker-alt me-1"></i>Address
                            </label>
                            <asp:TextBox ID="txtCustomerAddress" runat="server" CssClass="form-control"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvCustomerAddress" runat="server" ControlToValidate="txtCustomerAddress" ErrorMessage="Address is required" CssClass="text-danger" Display="Dynamic"></asp:RequiredFieldValidator>
                        </div>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <asp:Button ID="btnCancel" runat="server" Text="Cancel" CssClass="btn btn-secondary me-md-2" OnClick="btnCancel_Click" CausesValidation="false" />
                        <asp:Button ID="btnCompleteBooking" runat="server" CssClass="btn btn-primary" OnClick="btnCompleteBooking_Click" />
                    </div>
                </div>
            </div>
        </div>
    </div>

</asp:Content>