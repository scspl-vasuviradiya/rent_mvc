<%@ Page Title="Products Management" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Products.aspx.cs" Inherits="Products" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
            <i class="fas fa-tshirt me-2"></i>Products Management
        </h2>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-4">
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="txtSearchTerm" class="form-label">Search</label>
                    <asp:TextBox ID="txtSearchTerm" runat="server" CssClass="form-control" placeholder="Search by code or name..."></asp:TextBox>
                </div>
                <div class="col-md-3">
                    <label for="ddlFilterCategory" class="form-label">Category</label>
                    <asp:DropDownList ID="ddlFilterCategory" runat="server" CssClass="form-select">
                        <asp:ListItem Value="all" Text="All Categories" Selected="True"></asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="col-md-3">
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
                    <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-primary d-block w-100" OnClick="btnSearch_Click" />
                </div>
            </div>
        </div>
    </div>

    <!-- Products Table -->
    <asp:Panel ID="pnlProductsTable" runat="server">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <asp:GridView ID="gvProducts" runat="server" CssClass="table table-hover" AutoGenerateColumns="false" EmptyDataText="No products found.">
                        <Columns>
                            <asp:TemplateField HeaderText="Product">
                                <ItemTemplate>
                                    <div class="d-flex align-items-center">
                                        <img src='<%# Eval("ImageUrl") %>' alt='<%# Eval("Name") %>' class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                                        <div>
                                            <div class="fw-bold"><%# Eval("Name") %></div>
                                            <small class="text-muted"><%# Eval("Color") %></small>
                                        </div>
                                    </div>
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:BoundField DataField="Code" HeaderText="Code" />
                            <asp:BoundField DataField="Category" HeaderText="Category" />
                            <asp:BoundField DataField="Size" HeaderText="Size" />
                            <asp:TemplateField HeaderText="Price/Day">
                                <ItemTemplate>
                                    $<%# Eval("PricePerDay", "{0:F2}") %>
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Status">
                                <ItemTemplate>
                                    <span class='badge bg-<%# Eval("StatusColor") %>'><%# Eval("StatusText") %></span>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </div>
            </div>
        </div>
    </asp:Panel>

</asp:Content>