import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/theme/controllers/theme_controller.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

class ProductDetailsShimmer extends StatelessWidget {
  const ProductDetailsShimmer({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: Dimensions.paddingSizeSmall),
      child: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              height: MediaQuery.of(context).size.height,
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
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(10),
                          child: Container(
                            height: MediaQuery.of(context).size.width - 70,
                            padding: const EdgeInsets.all(
                                Dimensions.paddingSizeLarge),
                            decoration: BoxDecoration(
                                color: Provider.of<ThemeController>(context)
                                        .darkTheme
                                    ? Theme.of(context)
                                        .primaryColor
                                        .withValues(alpha: .05)
                                    : Theme.of(context).cardColor,
                                borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: Dimensions.paddingSizeSmall),
                                child: Container(
                                  height: 70,
                                  width: 70,
                                  decoration: BoxDecoration(
                                      color: Theme.of(context).cardColor,
                                      borderRadius: BorderRadius.circular(10)),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: Dimensions.paddingSizeSmall),
                                child: Container(
                                  height: 70,
                                  width: 70,
                                  decoration: BoxDecoration(
                                      color: Theme.of(context).cardColor,
                                      borderRadius: BorderRadius.circular(10)),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: Dimensions.paddingSizeSmall),
                                child: Container(
                                  height: 70,
                                  width: 70,
                                  decoration: BoxDecoration(
                                      color: Theme.of(context).cardColor,
                                      borderRadius: BorderRadius.circular(10)),
                                ),
                              ),
                            ]),
                        const SizedBox(
                          height: 15,
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 10),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width - 20,
                              color: Theme.of(context).cardColor),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 10),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width / 2,
                              color: Theme.of(context).cardColor),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 10),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width - 20,
                              color: Theme.of(context).cardColor),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 10),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width / 2,
                              color: Theme.of(context).cardColor),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 10),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width / 4,
                              color: Theme.of(context).cardColor),
                        ),
                        const SizedBox(height: 50),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Container(
                              height: 20,
                              width: MediaQuery.of(context).size.width - 20,
                              color: Theme.of(context).cardColor),
                        ),
                        const SizedBox(height: Dimensions.paddingSizeEight),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width - 20,
                              color: Theme.of(context).cardColor),
                        ),
                        const SizedBox(height: Dimensions.paddingSizeEight),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width - 20,
                              color: Theme.of(context).cardColor),
                        ),
                        const SizedBox(height: Dimensions.paddingSizeEight),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Container(
                              height: 10,
                              width: MediaQuery.of(context).size.width - 20,
                              color: Theme.of(context).cardColor),
                        ),
                        const SizedBox(height: 30),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Container(
                              height: 40,
                              width: MediaQuery.of(context).size.width - 20,
                              color: Theme.of(context).cardColor),
                        ),
                      ]),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
