import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:shimmer/shimmer.dart';

class NotificationShimmerWidget extends StatelessWidget {
  const NotificationShimmerWidget({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 10,
      padding: const EdgeInsets.all(0),
      itemBuilder: (context, index) {
        return Container(
            height: 80,
            margin: const EdgeInsets.only(bottom: Dimensions.paddingSizeSmall),
            color: Theme.of(context).highlightColor,
            alignment: Alignment.center,
            child: Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                enabled: true,
                child: ListTile(
                    leading:
                        const CircleAvatar(child: Icon(Icons.notifications)),
                    title: Container(
                        height: 20,
                        color:
                            Theme.of(context).colorScheme.secondaryContainer),
                    subtitle: Container(
                        height: 10,
                        width: 50,
                        color: Theme.of(context)
                            .colorScheme
                            .secondaryContainer))));
      },
    );
  }
}
