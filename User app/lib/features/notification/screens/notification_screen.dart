import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/features/notification/widget/notification_item_widget.dart';
import 'package:flutter_awis_ecommerce/features/notification/widget/notification_shimmer_widget.dart';
import 'package:flutter_awis_ecommerce/features/splash/controllers/splash_controller.dart';
import 'package:flutter_awis_ecommerce/localization/language_constrants.dart';
import 'package:flutter_awis_ecommerce/features/notification/controllers/notification_controller.dart';
import 'package:flutter_awis_ecommerce/main.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:flutter_awis_ecommerce/utill/images.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/custom_app_bar_widget.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/no_internet_screen_widget.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/paginated_list_view_widget.dart';
import 'package:flutter_awis_ecommerce/features/dashboard/screens/dashboard_screen.dart';
import 'package:provider/provider.dart';

class NotificationScreen extends StatefulWidget {
  final bool fromNotification;
  const NotificationScreen({super.key, this.fromNotification = false});
  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  ScrollController scrollController = ScrollController();

  @override
  void initState() {
    if (widget.fromNotification) {
      Provider.of<SplashController>(context, listen: false)
          .initConfig(context, null, null)
          .then((value) {
        Provider.of<NotificationController>(Get.context!, listen: false)
            .getNotificationList(1);
      });
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: CustomAppBar(
            title: getTranslated('notification', context),
            onBackPressed: () {
              if (Navigator.of(context).canPop()) {
                Navigator.of(context).pop();
              } else {
                Navigator.of(context).pushReplacement(MaterialPageRoute(
                    builder: (BuildContext context) =>
                        const DashBoardScreen()));
              }
            }),
        body: Consumer<NotificationController>(
            builder: (context, notificationController, child) {
          return notificationController.notificationModel != null
              ? (notificationController.notificationModel!.notification !=
                          null &&
                      notificationController
                          .notificationModel!.notification!.isNotEmpty)
                  ? RefreshIndicator(
                      onRefresh: () async =>
                          await notificationController.getNotificationList(1),
                      child: PaginatedListView(
                        scrollController: scrollController,
                        onPaginate: (int? offset) => notificationController
                            .getNotificationList(offset ?? 1),
                        totalSize:
                            notificationController.notificationModel?.totalSize,
                        offset:
                            notificationController.notificationModel?.offset,
                        itemView: Flexible(
                            child: ListView.separated(
                          controller: scrollController,
                          itemCount: notificationController
                              .notificationModel!.notification!.length,
                          itemBuilder: (context, index) =>
                              NotificationItemWidget(
                            notificationItem: notificationController
                                .notificationModel!.notification![index],
                            index: index,
                          ),
                          separatorBuilder: (BuildContext context, int index) =>
                              const SizedBox(
                                  height: Dimensions.paddingSizeExtraSmall),
                        )),
                      ),
                    )
                  : const NoInternetOrDataScreenWidget(
                      isNoInternet: false,
                      message: 'no_notification',
                      icon: Images.noNotification)
              : const NotificationShimmerWidget();
        }));
  }
}
