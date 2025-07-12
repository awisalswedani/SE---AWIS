import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';

abstract class BrandServiceInterface {
  Future<dynamic> getSellerWiseBrandList(int sellerId);
  Future<dynamic> getBrandList<T>({int offset, required DataSourceEnum source});
  Future<dynamic> getList();
}
