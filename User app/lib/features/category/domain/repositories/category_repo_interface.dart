import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class CategoryRepoInterface extends RepositoryInterface {
  Future<dynamic> getSellerWiseCategoryList(int sellerId);

  Future<ApiResponseModel<T>> getCategoryList<T>(
      {required DataSourceEnum source});
}
