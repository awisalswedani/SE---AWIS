import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class SearchProductRepositoryInterface implements RepositoryInterface {
  Future<dynamic> getSearchProductList(
      String query,
      String? categoryIds,
      String? brandIds,
      String? authorIds,
      String? publishingIds,
      String? sort,
      String? priceMin,
      String? priceMax,
      int offset,
      String? productType);
  Future<dynamic> getSearchProductName(String name);
  Future<dynamic> saveSearchProductName(String searchAddress);
  List<String> getSavedSearchProductName();
  Future<bool> clearSavedSearchProductName();
  Future<dynamic> getAuthorList(int? sellerId);
  Future<dynamic> getPublishingHouse(int? sellerId);
}
