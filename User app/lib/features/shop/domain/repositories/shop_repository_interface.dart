import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class ShopRepositoryInterface implements RepositoryInterface {
  Future<ApiResponseModel<T>> getMoreStore<T>({required DataSourceEnum source});
  Future<ApiResponseModel<T>> getSellerList<T>(
      {required String type,
      required int offset,
      required DataSourceEnum source});
  Future<dynamic> getClearanceShopProductList(
      String type, String offset, String sellerId);
  Future<dynamic> getClearanceSearchProduct(
      String sellerId, String offset, String productId,
      {String search = '',
      String? categoryIds,
      String? brandIds,
      String? authorIds,
      String? publishingIds,
      String? productType,
      String? offerType});
}
