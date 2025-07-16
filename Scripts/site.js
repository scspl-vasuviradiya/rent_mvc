// Site-wide JavaScript functionality

$(document).ready(function() {
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);

    // Form validation enhancement
    $('form').on('submit', function() {
        var submitBtn = $(this).find('input[type="submit"], button[type="submit"]');
        if (submitBtn.length > 0) {
            submitBtn.prop('disabled', true);
            var originalText = submitBtn.val() || submitBtn.text();
            submitBtn.val('Processing...').text('Processing...');
            
            // Re-enable button after 3 seconds to prevent permanent disable on validation errors
            setTimeout(function() {
                submitBtn.prop('disabled', false);
                submitBtn.val(originalText).text(originalText);
            }, 3000);
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

    // Table row hover effect
    $('.table tbody tr').on('mouseenter', function() {
        $(this).addClass('table-active');
    }).on('mouseleave', function() {
        $(this).removeClass('table-active');
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