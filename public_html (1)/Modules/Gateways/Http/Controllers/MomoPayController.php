<?php

namespace Modules\Gateways\Http\Controllers;

use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Modules\Gateways\Traits\Processor;
use Modules\Gateways\Entities\PaymentRequest;

class MomoPayController extends Controller
{
    use Processor;

    private mixed $config_values;
    private $api_user;
    private $subscription_key;
    private $target_environment;
    private $api_key;
    private string $config_mode;
    private PaymentRequest $payment;

    public function __construct(PaymentRequest $payment)
    {
        $config = $this->payment_config('momo', 'payment_config');
        if (!is_null($config) && $config->mode == 'live') {
            $this->config_values = json_decode($config->live_values);
        } elseif (!is_null($config) && $config->mode == 'test') {
            $this->config_values = json_decode($config->test_values);
        }

        if ($config) {
            $this->api_user = $this->config_values->api_user;
            $this->subscription_key = $this->config_values->subscription_key;
            $this->target_environment = $this->config_values?->target_environment;
            $this->api_key = $this->config_values->api_key;
            $this->config_mode = ($config->mode == 'test') ? 'test' : 'live';
        }

        $this->payment = $payment;
    }

    public function payment(Request $req): View|Application|Factory|JsonResponse|\Illuminate\Contracts\Foundation\Application
    {
        $validator = Validator::make($req->all(), [
            'payment_id' => 'required|uuid'
        ]);

        if ($validator->fails()) {
            return response()->json($this->response_formatter(GATEWAYS_DEFAULT_400, null, $this->error_processor($validator)), 400);
        }

        $data = $this->payment::where(['id' => $req['payment_id']])->where(['is_paid' => 0])->first();
        if (!isset($data)) {
            return response()->json($this->response_formatter(GATEWAYS_DEFAULT_204), 200);
        }

        return view('Gateways::payment.momo', compact('data'));
    }

    public function callback(Request $request): Application|JsonResponse|Redirector|\Illuminate\Contracts\Foundation\Application|RedirectResponse
    {
        $payment_id = $request->paymentID;
        $mobile_number = (string)str_replace([' ', '-','+'], '', $request->mobile_number);

        $response = $this->makePayment($payment_id, $mobile_number);

        if ($response->json('status') == 'SUCCESSFUL') {
            $this->payment::where(['id' => $payment_id])->update([
                'payment_method' => 'momo',
                'is_paid' => 1,
                'transaction_id' => $response->json('financialTransactionId'),
            ]);

            $data = $this->payment::where(['id' => $payment_id])->first();

            if (isset($data) && function_exists($data->success_hook)) {
                call_user_func($data->success_hook, $data);
            }
            return $this->payment_response($data, 'success');

        }
        $payment_data = $this->payment::where(['id' => $payment_id])->first();
        if (isset($payment_data) && function_exists($payment_data->failure_hook)) {
            call_user_func($payment_data->failure_hook, $payment_data);
        }
        return $this->payment_response($payment_data, 'fail');
    }

    public function makePayment($payment_id, $mobile_number): PromiseInterface|Response
    {
        $payment_data = $this->payment::where(['id' => $payment_id])->first();
        $base_url = $this->config_mode == 'test' ? 'https://sandbox.momodeveloper.mtn.com' : 'https://proxy.momoapi.mtn.com';
        $referenceID = $this->config_mode == 'test' ? Str::uuid() : $this->api_user;
        $ref = $this->config_mode == 'test' ? (string)$referenceID : Str::uuid();
        $primaryKey = $this->subscription_key;
        $target_environment = $this->target_environment ?? 'mtncameroon';
        $externalId = (string)$payment_data->attribute_id;

        $mobile = $mobile_number;

        $amount = (int)$payment_data->payment_amount;
        $amount = (string)$amount;
        if ($this->config_mode == 'test') {
            $response = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => (string) $primaryKey
            ])->post("{$base_url}/v1_0/apiuser/{$ref}/apikey",);
        }

        $username = $this->api_user;
        $password =$this->config_mode == 'test' ? (string)$response->json('apiKey') : $this->api_key;

        $basicAuth = base64_encode("{$username}:{$password}");

        $response = Http::withHeaders([
            'Authorization' => 'Basic ' . $basicAuth,
            'Ocp-Apim-Subscription-Key' => $primaryKey,
        ])->post("{$base_url}/collection/token/");


        $access = (string)$response->json('access_token');
        $BearerAuth = 'Bearer ' . $access;

        $response = Http::withHeaders([
            'Authorization' => $BearerAuth,
            'X-Reference-Id' => (string) $ref,
            'X-Target-Environment' => (string) $this->config_mode == 'test' ? 'sandbox' : $target_environment,
            'Ocp-Apim-Subscription-Key' => (string) $primaryKey,
            'Content-Type' => 'application/json',
        ])->post("{$base_url}/collection/v1_0/requesttopay", [
            "amount" => $amount,
            "currency" =>  $payment_data->currency_code,
            "externalId" => $externalId,
            "payer" => [
                "partyIdType" => "MSISDN",
                "partyId" => $mobile
            ],
            "payerMessage" => "Test Message",
            "payeeNote" => "Test Note"
        ]);

        sleep(40);
        $response = Http::withHeaders([
            'Authorization' => $BearerAuth,
            'Ocp-Apim-Subscription-Key' => (string)$primaryKey,
            'X-Target-Environment' => (string)$this->config_mode == 'test' ? 'sandbox' : $target_environment,
        ])->get("{$base_url}/collection/v1_0/requesttopay/{$ref}",);
        return $response;
    }
}
