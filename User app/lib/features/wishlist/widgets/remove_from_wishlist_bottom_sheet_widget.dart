import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/features/wishlist/controllers/wishlist_controller.dart';
import 'package:flutter_awis_ecommerce/localization/language_constrants.dart';
import 'package:flutter_awis_ecommerce/utill/custom_themes.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:flutter_awis_ecommerce/utill/images.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/custom_button_widget.dart';
import 'package:provider/provider.dart';

class RemoveFromWishlistBottomSheet extends StatelessWidget {
  final int? productId;
  final int? index;
  const RemoveFromWishlistBottomSheet(
      {super.key, required this.productId, required this.index});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(
          bottom: Dimensions.paddingSizeButton,
          top: Dimensions.paddingSizeDefault),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: const BorderRadius.vertical(
            top: Radius.circular(Dimensions.paddingSizeDefault)),
      ),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(
            width: Dimensions.paddingSizeButton,
            height: Dimensions.paddingSizeExtraSmall,
            decoration: BoxDecoration(
              color: Theme.of(context).hintColor.withValues(alpha: .5),
              borderRadius: BorderRadius.circular(Dimensions.paddingSizeLarge),
            )),
        const SizedBox(height: Dimensions.paddingSizeButton),
        Padding(
          padding: const EdgeInsets.symmetric(
              vertical: Dimensions.paddingSizeDefault),
          child: SizedBox(width: 60, child: Image.asset(Images.removeWish)),
        ),
        const SizedBox(height: Dimensions.paddingSizeDefault),
        Text(getTranslated('remove_from_wish', context)!,
            style: textBold.copyWith(
                fontSize: Dimensions.fontSizeLarge,
                color: Theme.of(context).textTheme.bodyLarge?.color)),
        Padding(
          padding: const EdgeInsets.only(
            top: Dimensions.paddingSizeSmall,
            bottom: Dimensions.paddingSizeLarge,
          ),
          child: Text(
            '${getTranslated('remove_this_item', context)}',
            style: textRegular.copyWith(
                color: Theme.of(context).textTheme.bodyLarge?.color),
          ),
        ),
        const SizedBox(height: Dimensions.paddingSizeSmall),
        Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: Dimensions.paddingSizeOverLarge),
          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            SizedBox(
                width: 120,
                child: CustomButton(
                  buttonText: '${getTranslated('cancel', context)}',
                  backgroundColor: Theme.of(context)
                      .colorScheme
                      .tertiaryContainer
                      .withValues(alpha: .5),
                  textColor: Theme.of(context).textTheme.bodyLarge?.color,
                  onTap: () => Navigator.pop(context),
                )),
            const SizedBox(width: Dimensions.paddingSizeDefault),
            SizedBox(
                width: 120,
                child: CustomButton(
                  buttonText: '${getTranslated('remove', context)}',
                  backgroundColor: Theme.of(context).colorScheme.error,
                  onTap: () {
                    Provider.of<WishListController>(context, listen: false)
                        .removeWishList(productId, index: index);
                    Navigator.of(context).pop();
                  },
                )),
          ]),
        )
      ]),
    );
  }
}
