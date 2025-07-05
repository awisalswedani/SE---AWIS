import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class FlashDealRepositoryInterface implements RepositoryInterface {
  Future<dynamic> getFlashDeal();
}
