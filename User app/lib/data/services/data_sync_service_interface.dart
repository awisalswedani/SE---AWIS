import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';

abstract class DataSyncServiceInterface {
  Future<ApiResponseModel<T>> fetchData<T>(String uri, DataSourceEnum source);
}
