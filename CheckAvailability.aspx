<%@ Page Title="Check Availability" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="CheckAvailability.aspx.cs" Inherits="CheckAvailability" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="row">
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">Select Rental Dates</h2>
                    
                    <asp:Panel ID="pnlProductInfo" runat="server" CssClass="d-flex align-items-center mb-3">
                        <asp:Image ID="imgProduct" runat="server" CssClass="rounded me-3" Width="60" Height="60" style="object-fit: cover;" />
                        <div>
                            <h5 class="mb-1"><asp:Literal ID="litProductName" runat="server"></asp:Literal></h5>
                            <p class="text-muted mb-0">$<asp:Literal ID="litPricePerDay" runat="server"></asp:Literal>/day</p>
                        </div>
                    </asp:Panel>
                    
                    <div class="mb-3">
                        <label for="txtStartDate" class="form-label">Start Date</label>
                        <asp:TextBox ID="txtStartDate" runat="server" CssClass="form-control" TextMode="Date" AutoPostBack="true" OnTextChanged="DateChanged"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvStartDate" runat="server" ControlToValidate="txtStartDate" ErrorMessage="Start date is required" CssClass="text-danger" Display="Dynamic"></asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="mb-3">
                        <label for="txtEndDate" class="form-label">End Date</label>
                        <asp:TextBox ID="txtEndDate" runat="server" CssClass="form-control" TextMode="Date" AutoPostBack="true" OnTextChanged="DateChanged"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvEndDate" runat="server" ControlToValidate="txtEndDate" ErrorMessage="End date is required" CssClass="text-danger" Display="Dynamic"></asp:RequiredFieldValidator>
                    </div>
                    
                    <asp:Panel ID="pnlPriceCalculation" runat="server" CssClass="bg-light p-3 rounded mb-3" Visible="false">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Duration:</span>
                            <span><asp:Literal ID="litTotalDays" runat="server"></asp:Literal> days</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Price per day:</span>
                            <span>$<asp:Literal ID="litPricePerDayCalc" runat="server"></asp:Literal></span>
                        </div>
                        <div class="d-flex justify-content-between border-top pt-2">
                            <strong>Total:</strong>
                            <strong class="text-primary">$<asp:Literal ID="litTotalPrice" runat="server"></asp:Literal></strong>
                        </div>
                    </asp:Panel>
                    
                    <asp:Panel ID="pnlAvailabilityMessage" runat="server" Visible="false">
                        <div class="alert" role="alert">
                            <asp:Literal ID="litAvailabilityMessage" runat="server"></asp:Literal>
                        </div>
                    </asp:Panel>
                    
                    <asp:Button ID="btnContinueBooking" runat="server" Text="Continue to Booking" CssClass="btn btn-primary w-100" OnClick="btnContinueBooking_Click" Enabled="false" />
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Current Status</h5>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span>Status:</span>
                            <span class="badge bg-<asp:Literal ID="litStatusColor" runat="server"></asp:Literal>"><asp:Literal ID="litStatus" runat="server"></asp:Literal></span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span>Price per day:</span>
                            <span class="fw-bold text-primary">$<asp:Literal ID="litProductPrice" runat="server"></asp:Literal></span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span>Washing time:</span>
                            <span><asp:Literal ID="litWashingDays" runat="server"></asp:Literal> days</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span>Next available:</span>
                            <span class="text-success">Today</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</asp:Content>