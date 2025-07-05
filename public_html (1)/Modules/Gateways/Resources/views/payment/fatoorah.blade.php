<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{translate('Embedded Payment')}}</title>
    <!-- Bootstrap 5 CDN for modern, responsive UI -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{asset('Modules/Gateways/public/assets/modules/css/fatoorah.css')}}">
    <style>
        body {
            background: #f4f6fb;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
        }
        .fatoorah-card {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            padding: 2.5rem 2rem 2rem 2rem;
            max-width: 420px;
            width: 100%;
            margin: 2rem auto;
        }
        .fatoorah-title {
            font-size: 1.7rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 1.2rem;
            text-align: center;
        }
        .alert {
            display: none;
            margin-bottom: 1.2rem;
        }
        #btn {
            width: 100%;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 8px;
            background: linear-gradient(90deg, #007bff 0%, #00c6ff 100%);
            color: #fff;
            border: none;
            transition: background 0.2s;
            margin-top: 1.5rem;
        }
        #btn:hover {
            background: linear-gradient(90deg, #0056b3 0%, #009ec3 100%);
        }
        #card-element {
            margin: 1.5rem 0 0.5rem 0;
        }
        @media (max-width: 600px) {
            .fatoorah-card {
                padding: 1.2rem 0.5rem 1.5rem 0.5rem;
                max-width: 98vw;
            }
            .fatoorah-title {
                font-size: 1.2rem;
            }
        }
    </style>
</head>

<body>
<div class="fatoorah-card">
    <div class="fatoorah-title">{{translate('Embedded Payment')}}</div>
    <div class="alert alert-danger" id="fatoorah-alert">
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        <span id="error_message"></span>
    </div>
    @if($mode == 'test')
        <script src="https://demo.myfatoorah.com/cardview/v1/session.js"></script>

    @elseif ($country_code == 'SAU')
        <script src="https://sa.myfatoorah.com/cardview/v1/session.js"></script>
    @elseif ($country_code == 'QAT')
        <script src="https://qa.myfatoorah.com/cardview/v1/session.js"></script>
    @else
        <script src="https://portal.myfatoorah.com/cardview/v1/session.js"></script>
    @endif

    <div id="card-element"></div>
    <button id="btn">{{translate('Pay Now')}}</button>
</div>


<script>
    'use strict';
    const config = {
        countryCode: "{{$country_code}}",
        sessionId: "{{$session_id}}",
        cardViewId: "card-element",
        style: {
            direction: "ltr",
            cardHeight: 180,
            input: {
                color: "#2d3748",
                fontSize: "15px",
                fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
                inputHeight: "38px",
                inputMargin: "0px",
                borderColor: "#c7c7c7",
                borderWidth: "1px",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                placeHolder: {
                    holderName: "Name On Card",
                    cardNumber: "Number",
                    expiryDate: "MM / YY",
                    securityCode: "CVV",
                }
            },
            label: {
                display: false,
                color: "#2d3748",
                fontSize: "14px",
                fontWeight: "normal",
                fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
                text: {
                    holderName: "Card Holder Name",
                    cardNumber: "Card Number",
                    expiryDate: "Expiry Date",
                    securityCode: "Security Code",
                },
            },
            error: {
                borderColor: "#e3342f",
                borderRadius: "8px",
                boxShadow: "0px",
            },
        },
    };
    myFatoorah.init(config);

    let btn = document.getElementById("btn")
    btn.addEventListener("click", submit)

    function submit() {
        myFatoorah.submit()
            // On success
            .then(function (response) {
                var sessionId = response.SessionId;
                var cardBrand = response.CardBrand;

                var request = new XMLHttpRequest();
                request.open("POST", "{{route('fatoorah.checkout', ['payment_id' => $payment_data->id])}}");
                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            console.log(JSON.parse(this.responseText));
                            location.href = JSON.parse(this.responseText);
                        } else {
                            console.log(this.response);
                            var error_field = document.getElementById("error_message");
                            var error_message = this.responseText;
                            let finalString = error_message.split('"').join('')
                            error_field.innerText = finalString;
                            document.getElementById('fatoorah-alert').style.display = 'block';
                        }

                    }
                };
                var data = new FormData();
                data.append('_token', '{{csrf_token()}}')
                data.append('sessionId', sessionId);
                data.append('cardBrand', cardBrand);
                request.send(data);
            })
            // In case of errors
            .catch(function (error) {
                var error_field = document.getElementById("error_message");
                error_field.innerText = error;
                document.getElementById('fatoorah-alert').style.display = 'block';
                console.log(error);
            });
    }
</script>

</body>

</html>
