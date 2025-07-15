// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(document).ready(function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);

    // Confirm delete actions
    $('.delete-confirm').on('click', function(e) {
        if (!confirm('Are you sure you want to delete this item?')) {
            e.preventDefault();
        }
    });

    // Date validation
    $('input[type="date"]').on('change', function() {
        var selectedDate = new Date($(this).val());
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('Please select a date that is today or in the future.');
            $(this).val('');
        }
    });

    // Form validation enhancement
    $('form').on('submit', function() {
        var submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true);
        submitBtn.html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing...');
        
        // Re-enable button after 3 seconds to prevent permanent disable on validation errors
        setTimeout(function() {
            submitBtn.prop('disabled', false);
            submitBtn.html(submitBtn.data('original-text') || 'Submit');
        }, 3000);
    });

    // Store original button text
    $('button[type="submit"]').each(function() {
        $(this).data('original-text', $(this).html());
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Add fade-in animation to cards
    $('.card').addClass('fade-in');

    // Search functionality enhancement
    $('#searchTerm').on('input', function() {
        var searchTerm = $(this).val().toLowerCase();
        if (searchTerm.length > 2) {
            // Add search suggestions or live filtering here
            console.log('Searching for: ' + searchTerm);
        }
    });

    // Price calculation for booking forms
    function calculatePrice() {
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        var pricePerDay = parseFloat($('#pricePerDay').val() || 0);
        
        if (startDate && endDate && pricePerDay > 0) {
            var start = new Date(startDate);
            var end = new Date(endDate);
            var timeDiff = end.getTime() - start.getTime();
            var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            
            if (daysDiff > 0) {
                var totalPrice = daysDiff * pricePerDay;
                $('#totalDays').text(daysDiff + ' days');
                $('#totalPrice').text('$' + totalPrice.toFixed(2));
                $('#priceCalculation').show();
            }
        }
    }

    // Bind price calculation to date changes
    $('#startDate, #endDate').on('change', calculatePrice);

    // Status update confirmation
    $('.status-update').on('click', function(e) {
        var newStatus = $(this).data('status');
        if (!confirm('Are you sure you want to change the status to ' + newStatus + '?')) {
            e.preventDefault();
        }
    });

    // Image lazy loading
    $('img[data-src]').each(function() {
        var img = $(this);
        img.attr('src', img.data('src')).removeAttr('data-src');
    });

    // Mobile menu enhancement
    $('.navbar-toggler').on('click', function() {
        $(this).toggleClass('active');
    });

    // Form field focus enhancement
    $('.form-control, .form-select').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        $(this).parent().removeClass('focused');
    });

    // Table row hover effect
    $('.table tbody tr').on('mouseenter', function() {
        $(this).addClass('table-active');
    }).on('mouseleave', function() {
        $(this).removeClass('table-active');
    });

    // Copy to clipboard functionality
    $('.copy-to-clipboard').on('click', function() {
        var textToCopy = $(this).data('text');
        navigator.clipboard.writeText(textToCopy).then(function() {
            // Show success message
            var btn = $('.copy-to-clipboard');
            var originalText = btn.html();
            btn.html('<i class="fas fa-check"></i> Copied!');
            setTimeout(function() {
                btn.html(originalText);
            }, 2000);
        });
    });

    // Auto-refresh for real-time updates (optional)
    if ($('.auto-refresh').length > 0) {
        setInterval(function() {
            location.reload();
        }, 30000); // Refresh every 30 seconds
    }
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    var alertClass = 'alert-' + type;
    var alertHtml = '<div class="alert ' + alertClass + ' alert-dismissible fade show" role="alert">' +
                   message +
                   '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                   '</div>';
    
    $('main').prepend(alertHtml);
    
    // Auto-hide after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
}

// Export functions for use in other scripts
window.ClothesRental = {
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    showNotification: showNotification
};