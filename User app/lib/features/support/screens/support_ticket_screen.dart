import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/features/support/controllers/support_ticket_controller.dart';
import 'package:flutter_awis_ecommerce/features/support/widgets/support_ticket_widget.dart';
import 'package:flutter_awis_ecommerce/features/support/widgets/support_ticket_shimmer.dart';
import 'package:flutter_awis_ecommerce/features/support/widgets/support_ticket_type_widget.dart';
import 'package:flutter_awis_ecommerce/localization/language_constrants.dart';
import 'package:flutter_awis_ecommerce/features/auth/controllers/auth_controller.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:flutter_awis_ecommerce/utill/images.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/custom_app_bar_widget.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/custom_button_widget.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/no_internet_screen_widget.dart';
import 'package:flutter_awis_ecommerce/common/basewidget/not_loggedin_widget.dart';
import 'package:provider/provider.dart';

class SupportTicketScreen extends StatefulWidget {
  const SupportTicketScreen({super.key});
  @override
  State<SupportTicketScreen> createState() => _SupportTicketScreenState();
}

class _SupportTicketScreenState extends State<SupportTicketScreen> {
  @override
  void initState() {
    if (Provider.of<AuthController>(context, listen: false).isLoggedIn()) {
      Provider.of<SupportTicketController>(context, listen: false)
          .getSupportTicketList();
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: getTranslated('support_ticket', context)),
      bottomNavigationBar:
          Provider.of<AuthController>(context, listen: false).isLoggedIn()
              ? SizedBox(
                  height: 70,
                  child: Padding(
                    padding: const EdgeInsets.all(Dimensions.paddingSizeEight),
                    child: CustomButton(
                      radius: Dimensions.paddingSizeExtraSmall,
                      buttonText: getTranslated('add_new_ticket', context),
                      onTap: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (con) => const SupportTicketTypeWidget(),
                        );
                      },
                    ),
                  ))
              : const SizedBox(),
      body: Consumer<SupportTicketController>(
        builder: (context, support, child) {
          return Provider.of<AuthController>(context, listen: false)
                  .isLoggedIn()
              ? support.supportTicketList != null
                  ? support.supportTicketList!.isNotEmpty
                      ? RefreshIndicator(
                          onRefresh: () async =>
                              await support.getSupportTicketList(),
                          child: ListView.separated(
                            itemCount: support.supportTicketList!.length,
                            itemBuilder: (context, index) =>
                                SupportTicketWidget(
                                    supportTicketModel:
                                        support.supportTicketList![index],
                                    index: index),
                            separatorBuilder: (BuildContext context,
                                    int index) =>
                                const SizedBox(
                                    height: Dimensions.paddingSizeExtraSmall),
                          ),
                        )
                      : const NoInternetOrDataScreenWidget(
                          isNoInternet: false,
                          icon: Images.noTicket,
                          message: 'no_ticket_created')
                  : const SupportTicketShimmer()
              : const NotLoggedInWidget();
        },
      ),
    );
  }
}
