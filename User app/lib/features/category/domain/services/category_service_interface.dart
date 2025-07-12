import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';

abstract class CategoryServiceInterface {
  Future<dynamic> getSellerWiseCategoryList(int sellerId);
  Future<ApiResponseModel<T>> getList<T>({required DataSourceEnum source});
}
