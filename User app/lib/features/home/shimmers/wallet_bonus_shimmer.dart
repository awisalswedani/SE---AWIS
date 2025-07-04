import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/theme/controllers/theme_controller.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

class WalletBonusListShimmer extends StatelessWidget {
  const WalletBonusListShimmer({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: Dimensions.homePagePadding),
      child: CarouselSlider.builder(
        options: CarouselOptions(
            viewportFraction: .95,
            autoPlay: true,
            enlargeFactor: 0.1,
            enlargeCenterPage: true,
            padEnds: true,
            disableCenter: true,
            onPageChanged: (index, reason) {}),
        itemCount: 2,
        itemBuilder: (context, index, _) {
          return SizedBox(
            height: 100,
            child: Container(
              margin: const EdgeInsets.all(5),
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Provider.of<ThemeController>(context).darkTheme
                      ? Theme.of(context).primaryColor.withValues(alpha: .05)
                      : Theme.of(context).cardColor,
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
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(
                            left: 8.0, right: 50, bottom: 8, top: 10),
                        child: Container(
                            height: 8,
                            padding: const EdgeInsets.all(
                                Dimensions.paddingSizeLarge),
                            decoration: BoxDecoration(
                                color: Provider.of<ThemeController>(context)
                                        .darkTheme
                                    ? Theme.of(context)
                                        .primaryColor
                                        .withValues(alpha: .05)
                                    : Theme.of(context).cardColor)),
                      ),
                      Padding(
                          padding: const EdgeInsets.only(left: 8.0, right: 150),
                          child: Container(
                              height: 7,
                              width: 50,
                              padding: const EdgeInsets.all(
                                  Dimensions.paddingSizeLarge),
                              decoration: BoxDecoration(
                                  color: Provider.of<ThemeController>(context)
                                          .darkTheme
                                      ? Theme.of(context)
                                          .primaryColor
                                          .withValues(alpha: .05)
                                      : Theme.of(context).cardColor))),
                      Padding(
                          padding: const EdgeInsets.only(
                              left: 8.0, right: 220, top: 20),
                          child: Container(
                              height: 5,
                              width: 50,
                              padding: const EdgeInsets.all(
                                  Dimensions.paddingSizeLarge),
                              decoration: BoxDecoration(
                                  color: Provider.of<ThemeController>(context)
                                          .darkTheme
                                      ? Theme.of(context)
                                          .primaryColor
                                          .withValues(alpha: .05)
                                      : Theme.of(context).cardColor))),
                      Padding(
                        padding: const EdgeInsets.only(
                            left: 8.0, right: 50, bottom: 8, top: 10),
                        child: Container(
                            height: 8,
                            padding: const EdgeInsets.all(
                                Dimensions.paddingSizeLarge),
                            decoration: BoxDecoration(
                                color: Provider.of<ThemeController>(context)
                                        .darkTheme
                                    ? Theme.of(context)
                                        .primaryColor
                                        .withValues(alpha: .05)
                                    : Theme.of(context).cardColor)),
                      ),
                      Padding(
                          padding: const EdgeInsets.only(left: 8.0, right: 150),
                          child: Container(
                              height: 7,
                              width: 50,
                              padding: const EdgeInsets.all(
                                  Dimensions.paddingSizeLarge),
                              decoration: BoxDecoration(
                                  color: Provider.of<ThemeController>(context)
                                          .darkTheme
                                      ? Theme.of(context)
                                          .primaryColor
                                          .withValues(alpha: .05)
                                      : Theme.of(context).cardColor))),
                      Padding(
                          padding: const EdgeInsets.only(
                              left: 8.0, right: 220, top: 20),
                          child: Container(
                              height: 5,
                              width: 50,
                              padding: const EdgeInsets.all(
                                  Dimensions.paddingSizeLarge),
                              decoration: BoxDecoration(
                                  color: Provider.of<ThemeController>(context)
                                          .darkTheme
                                      ? Theme.of(context)
                                          .primaryColor
                                          .withValues(alpha: .05)
                                      : Theme.of(context).cardColor))),
                      Padding(
                        padding: const EdgeInsets.only(
                            left: 8.0, right: 50, bottom: 8, top: 10),
                        child: Container(
                            height: 8,
                            padding: const EdgeInsets.all(
                                Dimensions.paddingSizeLarge),
                            decoration: BoxDecoration(
                                color: Provider.of<ThemeController>(context)
                                        .darkTheme
                                    ? Theme.of(context)
                                        .primaryColor
                                        .withValues(alpha: .05)
                                    : Theme.of(context).cardColor)),
                      ),
                      Padding(
                          padding: const EdgeInsets.only(left: 8.0, right: 150),
                          child: Container(
                              height: 7,
                              width: 50,
                              padding: const EdgeInsets.all(
                                  Dimensions.paddingSizeLarge),
                              decoration: BoxDecoration(
                                  color: Provider.of<ThemeController>(context)
                                          .darkTheme
                                      ? Theme.of(context)
                                          .primaryColor
                                          .withValues(alpha: .05)
                                      : Theme.of(context).cardColor))),
                      Padding(
                          padding: const EdgeInsets.only(
                              left: 8.0, right: 220, top: 20),
                          child: Container(
                              height: 5,
                              width: 50,
                              padding: const EdgeInsets.all(
                                  Dimensions.paddingSizeLarge),
                              decoration: BoxDecoration(
                                  color: Provider.of<ThemeController>(context)
                                          .darkTheme
                                      ? Theme.of(context)
                                          .primaryColor
                                          .withValues(alpha: .05)
                                      : Theme.of(context).cardColor))),
                    ]),
              ),
            ),
          );
        },
      ),
    );
  }
}
