import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/helper/price_converter.dart';
import 'package:flutter_awis_ecommerce/localization/language_constrants.dart';
import 'package:flutter_awis_ecommerce/utill/custom_themes.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/custom_button_widget.dart';

class WalletPaymentWidget extends StatelessWidget {
  final double rotateAngle;
  final Function()? onTap;
  final double orderAmount;
  final double currentBalance;

  const WalletPaymentWidget(
      {super.key,
      this.rotateAngle = 0,
      required this.onTap,
      required this.orderAmount,
      required this.currentBalance});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Padding(
        padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),
        child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(
                  getTranslated('wallet_payment', context)!,
                  style:
                      robotoBold.copyWith(fontSize: Dimensions.fontSizeLarge),
                ),
                InkWell(
                    onTap: () {
                      Navigator.of(context).pop();
                    },
                    child: const SizedBox(
                      child: Icon(Icons.clear),
                    ))
              ]),
              const SizedBox(
                height: Dimensions.paddingSizeExtraLarge,
              ),
              Text(
                getTranslated('your_current_balance', context)!,
                style: textRegular,
              ),
              const SizedBox(
                height: Dimensions.paddingSizeSmall,
              ),
              Container(
                  width: MediaQuery.of(context).size.width,
                  padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                  decoration: BoxDecoration(
                      color: Theme.of(context).hintColor.withValues(alpha: .1),
                      border: Border.all(
                          width: .5, color: Theme.of(context).hintColor),
                      borderRadius: BorderRadius.circular(
                          Dimensions.paddingSizeExtraSmall)),
                  child: Text(
                      PriceConverter.convertPrice(context, currentBalance))),
              const SizedBox(
                height: Dimensions.paddingSizeDefault,
              ),
              Text(
                getTranslated('order_amount', context)!,
                style: textRegular,
              ),
              const SizedBox(
                height: Dimensions.paddingSizeSmall,
              ),
              Container(
                  width: MediaQuery.of(context).size.width,
                  padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                  decoration: BoxDecoration(
                      color: Theme.of(context).hintColor.withValues(alpha: .1),
                      border: Border.all(
                          width: .5, color: Theme.of(context).hintColor),
                      borderRadius: BorderRadius.circular(
                          Dimensions.paddingSizeExtraSmall)),
                  child:
                      Text(PriceConverter.convertPrice(context, orderAmount))),
              const SizedBox(
                height: Dimensions.paddingSizeDefault,
              ),
              Text(
                getTranslated('remaining_balance', context)!,
                style: textRegular,
              ),
              const SizedBox(
                height: Dimensions.paddingSizeSmall,
              ),
              Container(
                  width: MediaQuery.of(context).size.width,
                  padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                  decoration: BoxDecoration(
                      color: Theme.of(context).hintColor.withValues(alpha: .1),
                      border: Border.all(
                          width: .5, color: Theme.of(context).hintColor),
                      borderRadius: BorderRadius.circular(
                          Dimensions.paddingSizeExtraSmall)),
                  child: Text(PriceConverter.convertPrice(
                      context, (currentBalance - orderAmount)))),
              const SizedBox(height: Dimensions.paddingSizeExtraLarge),
              Row(
                children: [
                  Expanded(
                      child: CustomButton(
                          buttonText: getTranslated('cancel', context),
                          backgroundColor: Theme.of(context).hintColor,
                          onTap: () => Navigator.of(context).pop())),
                  const SizedBox(width: Dimensions.paddingSizeDefault),
                  Expanded(
                      child: CustomButton(
                          buttonText: getTranslated('submit', context),
                          onTap: onTap))
                ],
              )
            ]),
      ),
    );
  }
}
