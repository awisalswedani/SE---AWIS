import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class BrandShimmerWidget extends StatelessWidget {
  final bool isHomePage;
  const BrandShimmerWidget({super.key, required this.isHomePage});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        childAspectRatio: (1/1.3),
        mainAxisSpacing: 10,
        crossAxisSpacing: 5,),
      itemCount: isHomePage ? 8 : 30,
      shrinkWrap: true,
      physics: isHomePage ? const NeverScrollableScrollPhysics() : null,
      itemBuilder: (BuildContext context, int index) {

        return Shimmer.fromColors(
          baseColor: Theme.of(context).cardColor,
          highlightColor: Colors.grey[100]!,
          enabled: true,
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Expanded(child: Container(decoration: BoxDecoration(color:  Theme.of(context).colorScheme.secondaryContainer, shape: BoxShape.circle))),
            Container(height: 10, color:  Theme.of(context).colorScheme.secondaryContainer, margin: const EdgeInsets.only(left: 25, right: 25)),
          ]),
        );
      },
    );
  }
}