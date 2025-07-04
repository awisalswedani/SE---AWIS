import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';

abstract class BannerServiceInterface {
  Future<ApiResponseModel<T>> getList<T>({required DataSourceEnum source});
}
