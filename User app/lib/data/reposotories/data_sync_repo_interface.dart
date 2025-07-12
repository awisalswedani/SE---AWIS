import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class DataSyncRepoInterface extends RepositoryInterface {
  Future<ApiResponseModel<T>> fetchData<T>(String uri, DataSourceEnum source);
}
