import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/theme/controllers/theme_controller.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

class TopStoreShimmer extends StatelessWidget {
  const TopStoreShimmer({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(Dimensions.paddingSizeSmall, 0,
          Dimensions.paddingSizeSmall, Dimensions.paddingSizeDefault),
      child: SizedBox(
        height: 150,
        child: ListView.builder(
            itemCount: 2,
            shrinkWrap: true,
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.zero,
            itemBuilder: (context, index) {
              return Container(
                margin: const EdgeInsets.all(5),
                width: 240,
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
                        Container(
                            height: 60,
                            padding: const EdgeInsets.all(
                                Dimensions.paddingSizeLarge),
                            decoration: BoxDecoration(
                                color: Provider.of<ThemeController>(context)
                                        .darkTheme
                                    ? Theme.of(context)
                                        .primaryColor
                                        .withValues(alpha: .05)
                                    : Theme.of(context).cardColor,
                                borderRadius: const BorderRadius.vertical(
                                    top: Radius.circular(10)))),
                        Padding(
                          padding:
                              const EdgeInsets.all(Dimensions.paddingSizeSmall),
                          child: Row(
                            children: [
                              Container(
                                  transform:
                                      Matrix4.translationValues(0, -30, 0),
                                  height: 50,
                                  width: 50,
                                  padding: const EdgeInsets.all(
                                      Dimensions.paddingSizeLarge),
                                  decoration: BoxDecoration(
                                      color:
                                          Provider.of<ThemeController>(context)
                                                  .darkTheme
                                              ? Theme.of(context)
                                                  .primaryColor
                                                  .withValues(alpha: .05)
                                              : Theme.of(context).cardColor,
                                      borderRadius:
                                          BorderRadius.circular(100))),
                              const SizedBox(
                                width: 20,
                              ),
                              Expanded(
                                child: Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                          height: 12,
                                          color: Theme.of(context).cardColor),
                                      const SizedBox(
                                          height: Dimensions.paddingSizeEight),
                                      Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Container(
                                                height: 8,
                                                width: 50,
                                                color: Theme.of(context)
                                                    .colorScheme
                                                    .secondaryContainer),
                                            const Icon(Icons.star,
                                                color: Colors.orange, size: 15),
                                          ]),
                                      const SizedBox(height: 10),
                                      Row(children: [
                                        Container(
                                            height: 10,
                                            width: 60,
                                            color: Theme.of(context).cardColor),
                                        const SizedBox(
                                          width: 10,
                                        ),
                                        Container(
                                            height: 10,
                                            width: 60,
                                            color: Theme.of(context).cardColor)
                                      ]),
                                      const SizedBox(
                                        width: 10,
                                      ),
                                    ]),
                              ),
                            ],
                          ),
                        ),
                      ]),
                ),
              );
            }),
      ),
    );
  }
}
