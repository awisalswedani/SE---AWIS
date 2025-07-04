@extends('layouts.admin.app')
@section('title', translate('earning_Statement'))

@section('content')
    <div class="content container-fluid">
        <div class="mb-4 pb-2">
            <h2 class="h1 mb-0 text-capitalize d-flex align-items-center gap-2">
                <img src="{{dynamicAsset(path: 'public/assets/back-end/img/add-new-seller.png')}}" alt="">
                {{translate('earning_statement')}}
            </h2>
        </div>
        @include('admin-views.delivery-man.pages-inline-menu')

        <div class="card mb-3">
            <div class="card-body">

                <div class="row justify-content-between align-items-center g-2 mb-3">
                    <div class="col-sm-6">
                        <h3 class="d-flex align-items-center text-capitalize gap-2 mb-0">
                            <img width="20" class="mb-1" src="{{dynamicAsset(path: 'public/assets/back-end/img/admin-wallet.png')}}" alt="">
                            {{translate('deliveryman_Wallet')}}
                        </h3>
                    </div>
                </div>

                <div class="row g-2" id="order_stats">
                    <div class="col-lg-4">
                        <div class="card h-100 d-flex justify-content-center align-items-center">
                            <div class="card-body d-flex flex-column gap-2 align-items-center justify-content-center">
                                <img width="48" src="{{dynamicAsset(path: 'public/assets/back-end/img/cc.png')}}" alt="">
                                <h3 class="for-card-count mb-0 h1">{{ $deliveryMan->wallet ? setCurrencySymbol(amount: usdToDefaultCurrency(amount: $deliveryMan->wallet->cash_in_hand), currencyCode: getCurrencyCode()) : setCurrencySymbol(amount: 0, currencyCode: getCurrencyCode()) }}</h3>
                                <div class="fw-bold text-capitalize mb-30">
                                    {{translate('cash_in_hand')}}
                                </div>
                            </div>
                            <a href="{{ route('admin.delivery-man.collect-cash', ['id' => $deliveryMan->id]) }}" class="btn btn-primary mb-4">{{translate('collect_Cash')}}</a>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="row g-2">
                            <div class="col-md-6">
                                <div class="card card-body h-100 justify-content-center py-5">
                                    <div class="d-flex gap-2 justify-content-between align-items-center">
                                        <div class="d-flex flex-column align-items-start">
                                            <h3 class="mb-1 h1">{{ $deliveryMan->wallet ? setCurrencySymbol(amount: usdToDefaultCurrency(amount: $deliveryMan->wallet->current_balance), currencyCode: getCurrencyCode()) : setCurrencySymbol(amount: 0, currencyCode: getCurrencyCode())}}</h3>
                                            <div class="text-capitalize mb-0">{{translate('current_balance')}}</div>
                                        </div>
                                        <div>
                                            <img width="40" src="{{dynamicAsset(path: 'public/assets/back-end/img/withdraw-icon.png')}}" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card card-body h-100 justify-content-center py-5">
                                    <div class="d-flex gap-2 justify-content-between align-items-center">
                                        <div class="d-flex flex-column align-items-start">
                                            <h3 class="mb-1 h1">{{ $deliveryMan->wallet ? setCurrencySymbol(amount: usdToDefaultCurrency(amount: $deliveryMan->wallet->total_withdraw), currencyCode: getCurrencyCode()) : setCurrencySymbol(amount: 0, currencyCode: getCurrencyCode())}}</h3>
                                            <div class="text-capitalize mb-0">{{translate('total_withdrawn')}}</div>
                                        </div>
                                        <div>
                                            <img width="40" src="{{dynamicAsset(path: 'public/assets/back-end/img/aw.png')}}" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card card-body h-100 justify-content-center py-5">
                                    <div class="d-flex gap-2 justify-content-between align-items-center">
                                        <div class="d-flex flex-column align-items-start">
                                            <h3 class="mb-1 h1">{{$deliveryMan->wallet ? setCurrencySymbol(amount: usdToDefaultCurrency(amount: $deliveryMan->wallet->pending_withdraw), currencyCode: getCurrencyCode()) : setCurrencySymbol(amount: 0, currencyCode: getCurrencyCode())}}</h3>
                                            <div class="text-capitalize mb-0">{{translate('pending_withdraw')}}</div>
                                        </div>
                                        <div>
                                            <img width="40" class="mb-2" src="{{dynamicAsset(path: 'public/assets/back-end/img/pw.png')}}" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card card-body h-100 justify-content-center py-5">
                                    <div class="d-flex gap-2 justify-content-between align-items-center">
                                        <div class="d-flex flex-column align-items-start">
                                            <h3 class="mb-1 h1">
                                                {{ $withdrawalableBalance <= 0 ? setCurrencySymbol(amount: 0, currencyCode: getCurrencyCode()) : setCurrencySymbol(amount: usdToDefaultCurrency(amount: $withdrawalableBalance), currencyCode: getCurrencyCode()) }}
                                            </h3>
                                            <div class="text-capitalize mb-0">{{translate('withdrawable_balance')}}</div>
                                        </div>
                                        <div>
                                            <img width="40" class="mb-2" src="{{dynamicAsset(path: 'public/assets/back-end/img/withdraw.png')}}" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 mt-3">
                <div class="card">
                    <div class="card-header text-capitalize">
                        <h4 class="mb-0">{{translate('delivery_Man_Account')}}</h4>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-start">
                            <div><h3>{{translate('status')}} : </h3></div>
                            <div class="mx-1">
                                <h3>{!! $deliveryMan->is_active == 1?'<label class="badge badge-success text-bg-success">Active</label>':'<label class="badge badge-danger">In-Active</label>' !!}</h3>
                            </div>
                        </div>
                        <div class="d-flex justify-content-start">
                            <div><h4 class="text-nowrap">{{translate('name')}} : </h4></div>
                            <div class="mx-1"><h5>{{$deliveryMan->f_name}} {{$deliveryMan->l_name}}</h5></div>
                        </div>
                        <div class="d-flex justify-content-start">
                            <div><h4 class="text-nowrap">{{translate('email')}} : </h4></div>
                            <div class="mx-1"><h5>{{$deliveryMan->email}}</h5></div>
                        </div>
                        <div class="d-flex justify-content-start">
                            <div><h4 class="text-nowrap">{{translate('phone')}} : </h4></div>
                            <div class="mx-1"><h5>{{$deliveryMan->phone}}</h5></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mt-3">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"> {{translate('bank_info')}}</h5>
                    </div>
                    <div class="card-body">
                        <div class="mt-2">
                            <div class="d-flex justify-content-start">
                                <div><h3 class="text-nowrap">{{translate('bank_name')}} : </h3></div>
                                <div class="mx-1">
                                    <h3>{{$deliveryMan->bank_name ?? translate('no_Data_found')}}</h3>
                                </div>
                            </div>
                            <div class="d-flex justify-content-start">
                                <div><h5 class="text-nowrap">{{translate('branch')}} : </h5></div>
                                <div class="mx-1">
                                    <h5>{{$deliveryMan->branch ?? translate('no_Data_found')}}</h5>
                                </div>
                            </div>
                            <div class="d-flex justify-content-start">
                                <div><h5 class="text-nowrap">{{translate('holder_name')}} : </h5></div>
                                <div class="mx-1">
                                    <h5>{{$deliveryMan->holder_name ?? translate('no_Data_found')}}</h5>
                                </div>
                            </div>
                            <div class="d-flex justify-content-start">
                                <div><h5 class="text-nowrap">{{translate('account_no')}} : </h5></div>
                                <div class="mx-1">
                                    <h5>{{$deliveryMan->account_no ?? translate('no_Data_found')}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade py-5" id="exampleModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{translate('cash_Withdraw')}}</h5>
                    <button id="invoice_close" type="button" class="close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body row">
                    <div class="col-md-12 mb-3">
                        <div class="d-flex flex-wrap gap-2 mt-3 title-color" id="chosen_price_div">
                            <div class="product-description-label">{{translate('total_Cash_In_Hand')}}: </div>
                            <div class="product-price">
                                <strong>{{ $deliveryMan->wallet ? setCurrencySymbol(amount: usdToDefaultCurrency(amount: $deliveryMan->wallet->cash_in_hand), currencyCode: getCurrencyCode()) : 0  }}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 mb-3">
                        <input type="number" class="form-control" name="amount" placeholder="Enter Amount to withdraw">
                    </div>
                    <div class="col-md-12 mb-3">
                        <div class="text-center">
                            <form action="">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">{{translate('collect_Cash')}}</button>
                            </form>
                        </div>
                        <hr class="non-printable">
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
