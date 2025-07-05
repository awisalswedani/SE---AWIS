import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class BannerRepositoryInterface<T> implements RepositoryInterface {
  Future<ApiResponseModel<T>> getBannerList<T>(
      {required DataSourceEnum source});
}
