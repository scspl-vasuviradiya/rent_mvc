<%@ Page Title="Booking Confirmed" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="BookingConfirmation.aspx.cs" Inherits="BookingConfirmation" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="row justify-content-center">
        <div class="col-lg-6">
            <div class="card text-center">
                <div class="card-body py-5">
                    <div class="mb-4">
                        <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                    </div>
                    
                    <h2 class="card-title text-success mb-3">Booking Confirmed!</h2>
                    <p class="card-text text-muted mb-4">Your rental has been successfully booked.</p>
                    
                    <div class="bg-light p-4 rounded mb-4">
                        <h5 class="mb-3">Booking Details</h5>
                        <div class="d-flex align-items-center justify-content-center mb-3">
                            <asp:Image ID="imgProduct" runat="server" CssClass="rounded me-3" Width="60" Height="60" style="object-fit: cover;" />
                            <div>
                                <h6 class="mb-1"><asp:Literal ID="litProductName" runat="server"></asp:Literal></h6>
                                <p class="text-muted mb-0">Booking #<asp:Literal ID="litBookingId" runat="server"></asp:Literal></p>
                            </div>
                        </div>
                        
                        <div class="row text-center">
                            <div class="col-md-4">
                                <small class="text-muted">Start Date</small>
                                <div class="fw-bold"><asp:Literal ID="litStartDate" runat="server"></asp:Literal></div>
                            </div>
                            <div class="col-md-4">
                                <small class="text-muted">End Date</small>
                                <div class="fw-bold"><asp:Literal ID="litEndDate" runat="server"></asp:Literal></div>
                            </div>
                            <div class="col-md-4">
                                <small class="text-muted">Total Price</small>
                                <div class="fw-bold text-primary">$<asp:Literal ID="litTotalPrice" runat="server"></asp:Literal></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert alert-warning">
                        <h6 class="alert-heading">Important Notes:</h6>
                        <ul class="list-unstyled mb-0 text-start">
                            <li>• Please arrive 30 minutes early for fitting</li>
                            <li>• Return the item by 6 PM on the end date</li>
                            <li>• Item will be sent for washing after return</li>
                            <li>• Late returns may incur additional charges</li>
                        </ul>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                        <asp:Button ID="btnBackToHome" runat="server" Text="Back to Home" CssClass="btn btn-primary" OnClick="btnBackToHome_Click" />
                        <asp:Button ID="btnViewBookings" runat="server" Text="View All Bookings" CssClass="btn btn-outline-secondary" OnClick="btnViewBookings_Click" />
                    </div>
                </div>
            </div>
        </div>
    </div>

</asp:Content>