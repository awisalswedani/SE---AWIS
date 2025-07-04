<div class="modal fade" id="add-coupon-discount" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">{{ translate('coupon_discount') }}</h3>
                <button id="coupon_close" type="button" class="btn-close border-0 btn-circle bg-section2 shadow-none" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="title-color mb-1">{{ translate('coupon_code') }}</label>
                    <input type="text" id="coupon_code" class="form-control" name="coupon_code"
                           placeholder="SULTAN200">
                </div>

                <div class="form-group">
                    <button class="btn btn-primary action-coupon-discount"
                            data-error-message="{{ translate('please_enter_coupon_code')}}">
                        {{ translate('submit') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
