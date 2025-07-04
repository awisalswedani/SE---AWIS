import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/theme/controllers/theme_controller.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

class CartPageShimmerWidget extends StatelessWidget {
  const CartPageShimmerWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 10,
      padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 10.0),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(5),
                border: Border.all(color: Theme.of(context).cardColor),
                color: Theme.of(context).canvasColor,
                boxShadow: [
                  BoxShadow(
                      color: Colors.grey.withValues(alpha: 0.3),
                      spreadRadius: 1,
                      blurRadius: 5)
                ]),
            child: Shimmer.fromColors(
              baseColor: Theme.of(context).cardColor,
              highlightColor: Colors.grey[300]!,
              enabled: true,
              child: Padding(
                padding:
                    const EdgeInsets.only(bottom: Dimensions.paddingSizeSmall),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(bottom: 10.0),
                      child: Container(
                          height: 15,
                          width: MediaQuery.of(context).size.width / 2,
                          color: Provider.of<ThemeController>(context).darkTheme
                              ? Theme.of(context)
                                  .primaryColor
                                  .withValues(alpha: .05)
                              : Theme.of(context).cardColor),
                    ),
                    Row(children: [
                      Container(
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(5),
                            color: Theme.of(context).cardColor),
                        width: 80,
                        height: 80,
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: Dimensions.paddingSizeSmall),
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                    height: 15,
                                    color: Provider.of<ThemeController>(context)
                                            .darkTheme
                                        ? Theme.of(context)
                                            .primaryColor
                                            .withValues(alpha: .05)
                                        : Theme.of(context).cardColor),
                                const SizedBox(
                                    height: Dimensions.paddingSizeExtraSmall),
                                Container(
                                    height: 15,
                                    color: Provider.of<ThemeController>(context)
                                            .darkTheme
                                        ? Theme.of(context)
                                            .primaryColor
                                            .withValues(alpha: .05)
                                        : Theme.of(context).cardColor),
                                const SizedBox(
                                    height: Dimensions.paddingSizeExtraSmall),
                                Row(
                                  children: [
                                    Container(
                                        height: 15,
                                        width: 120,
                                        color: Provider.of<ThemeController>(
                                                    context)
                                                .darkTheme
                                            ? Theme.of(context)
                                                .primaryColor
                                                .withValues(alpha: .05)
                                            : Theme.of(context).cardColor),
                                  ],
                                ),
                                const SizedBox(
                                    height: Dimensions.paddingSizeExtraSmall),
                                Row(
                                  children: [
                                    Container(
                                        height: 15,
                                        width: 120,
                                        color: Provider.of<ThemeController>(
                                                    context)
                                                .darkTheme
                                            ? Theme.of(context)
                                                .primaryColor
                                                .withValues(alpha: .05)
                                            : Theme.of(context).cardColor),
                                  ],
                                ),
                                const SizedBox(
                                    height: Dimensions.paddingSizeExtraSmall),
                                Row(
                                  children: [
                                    Container(
                                        height: 15,
                                        width: 120,
                                        color: Provider.of<ThemeController>(
                                                    context)
                                                .darkTheme
                                            ? Theme.of(context)
                                                .primaryColor
                                                .withValues(alpha: .05)
                                            : Theme.of(context).cardColor),
                                  ],
                                ),
                                const SizedBox(
                                    height: Dimensions.paddingSizeExtraSmall),
                                Row(
                                  children: [
                                    Container(
                                        height: 15,
                                        width: 120,
                                        color: Provider.of<ThemeController>(
                                                    context)
                                                .darkTheme
                                            ? Theme.of(context)
                                                .primaryColor
                                                .withValues(alpha: .05)
                                            : Theme.of(context).cardColor),
                                  ],
                                ),
                              ]),
                        ),
                      ),
                      Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                                height: 10,
                                width: 30,
                                color: Theme.of(context)
                                    .colorScheme
                                    .secondaryContainer),
                            const SizedBox(height: Dimensions.paddingSizeSmall),
                            Container(
                              height: 15,
                              width: 15,
                              decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Theme.of(context).primaryColor),
                            ),
                          ])
                    ]),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
