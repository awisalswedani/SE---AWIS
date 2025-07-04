import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/helper/color_helper.dart';
import 'package:flutter_awis_ecommerce/localization/language_constrants.dart';
import 'package:flutter_awis_ecommerce/theme/controllers/theme_controller.dart';
import 'package:flutter_awis_ecommerce/utill/custom_themes.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:flutter_awis_ecommerce/utill/images.dart';
import 'package:provider/provider.dart';

class ReferHintView extends StatelessWidget {
  final List<String> hintList;
  const ReferHintView({super.key, required this.hintList});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: const BorderRadius.only(
                topRight: Radius.circular(20), topLeft: Radius.circular(20))),
        child: Container(
          padding: const EdgeInsets.all(Dimensions.paddingSizeDefault),
          decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
              border: Border(
                top: BorderSide(
                    color:
                        Theme.of(context).primaryColor.withValues(alpha: 0.2),
                    width: 2),
                left: BorderSide(
                    color:
                        Theme.of(context).primaryColor.withValues(alpha: 0.2),
                    width: 2),
                right: BorderSide(
                    color:
                        Theme.of(context).primaryColor.withValues(alpha: 0.2),
                    width: 2),
                //color: Theme.of(context).primaryColor.withValues(alpha:0.2), width: 2
              ),
              borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(20), topLeft: Radius.circular(20))),
          child: Column(
            children: [
              Container(
                  decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(15)),
                  height: Dimensions.paddingSizeExtraSmall,
                  width: 30),
              const SizedBox(
                height: Dimensions.paddingSizeDefault,
              ),
              Row(
                children: [
                  Image.asset(
                    Images.iMark,
                    height: Dimensions.paddingSizeLarge,
                  ),
                  const SizedBox(
                    width: Dimensions.paddingSizeSmall,
                  ),
                  Text(
                    '${getTranslated('how_it_works', context)}',
                    style: textRegular.copyWith(
                        fontSize: Dimensions.fontSizeLarge,
                        color: Theme.of(context).textTheme.bodyLarge!.color),
                  )
                ],
              ),
              const SizedBox(
                height: Dimensions.paddingSizeSmall,
              ),
              Column(
                children: hintList
                    .map(
                      (hint) => Row(
                        children: [
                          Container(
                              margin: const EdgeInsets.all(
                                  Dimensions.paddingSizeExtraSmall),
                              padding: const EdgeInsets.all(
                                  Dimensions.paddingSizeDefault),
                              decoration: BoxDecoration(
                                  color: Provider.of<ThemeController>(context)
                                          .darkTheme
                                      ? ColorHelper.darken(
                                          Theme.of(context)
                                              .colorScheme
                                              .onPrimary,
                                          1)
                                      : Theme.of(context).colorScheme.onPrimary,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                        color: Theme.of(context)
                                            .textTheme
                                            .bodyLarge!
                                            .color!
                                            .withValues(alpha: 0.10),
                                        blurRadius: 6,
                                        offset: const Offset(0, 3))
                                  ]),
                              child: Text('${hintList.indexOf(hint) + 1}',
                                  style: robotoBold.copyWith(
                                    fontSize: Dimensions.fontSizeLarge,
                                  ))),
                          const SizedBox(
                            width: Dimensions.paddingSizeSmall,
                          ),
                          Flexible(
                              child: Text(hint,
                                  style: textRegular.copyWith(
                                      fontSize: Dimensions.fontSizeLarge,
                                      color: Theme.of(context)
                                          .textTheme
                                          .bodyLarge
                                          ?.color))),
                        ],
                      ),
                    )
                    .toList(),
              )
            ],
          ),
        ),
      ),
    );
  }
}
