"use strict";

$(document).ready(function () {

    $('#discount_percent').hide();
    let discount_type = $('#discount_type').val();
    if (discount_type == 'amount') {
        $('#max-discount').hide()
    } else if (discount_type == 'percentage') {
        $('#max-discount').show()
    }
    if ($('#code').val() == '') {
        generateCode();
    }

    $('#start_date').attr('min', (new Date()).toISOString().split('T')[0]);
    $('#expire_date').attr('min', (new Date()).toISOString().split('T')[0]);

    field_show_hide();

});

$("#start_date").on("change", function () {
    $('#expire_date').attr('min', $(this).val());
});

$("#expire_date").on("change", function () {
    $('#start_date').attr('max', $(this).val());
});

$('.get-quick-view').on('click', function () {
    let id = $(this).data('id');
    let url = $('#get-detail-url').data('url');
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            id: id
        },
        beforeSend: function () {
            $('#loading').fadeIn();
        },
        success: function (data) {
            console.log(data)
            $('#loading').fadeOut();
            $('#quick-view').modal('show');
            $('#quick-view-modal').empty().html(data.view);
        }
    });
});

$("#discount_type").on("change", function () {
    let value = this.value;
    if (value == 'amount') {
        $('#max-discount').hide()
    } else if (value == 'percentage') {
        $('#max-discount').show()
    }
});

$("#generateCode").on("click", function () {
    generateCode();
});

function generateCode() {
    let code = Math.random().toString(36).substring(2, 12);
    $('#code').val(code)
}

$('#discount_type').on('change', function () {
    let type = $('#discount_type').val();
    if (type === 'amount') {
        $('#discount').attr({
            'placeholder': 'Ex: 500',
            "max": "1000000"
        });
        $('#discount_percent').hide();
    } else if (type === 'percentage') {
        $('#discount').attr({
            "max": "100",
            "placeholder": "Ex: 10%"
        });
        $('#discount_percent').show();
    }
});

$('#coupon_type').on('change', function () {
    field_show_hide();
});

function field_show_hide() {
    let discount_type = $('#discount_type').val();
    let type = $('#coupon_type').val();

    if (type === 'free_delivery') {
        if (discount_type === 'amount') {
            $('.free_delivery').hide();
        } else if (discount_type === 'percentage') {
            $('.free_delivery').hide();
        }
    } else {
        if (discount_type === 'amount') {
            $('.free_delivery').show();
            $('#max-discount').hide()
        } else if (discount_type === 'percentage') {
            $('.free_delivery').show();
            $('#max-discount').show()
        }
    }
}

$('.coupon_status_form').on('submit', function(event){
    event.preventDefault();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    $.ajax({
        url: $(this).attr('action'),
        method: 'GET',
        data: $(this).serialize(),
        success: function (data) {
            toastMagic.success(data.message);
        }
    });
});

$(".js-example-theme-single").select2({
    theme: "classic"
});

$(".js-example-responsive").select2({
    width: 'resolve'
});
