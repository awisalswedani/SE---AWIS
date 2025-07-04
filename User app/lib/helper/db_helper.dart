import 'package:flutter_awis_ecommerce/data/local/cache_response.dart';
import 'package:flutter_awis_ecommerce/main.dart';

class DbHelper {
  static insertOrUpdate(
      {required String id, required CacheResponseCompanion data}) async {
    final response = await database.getCacheResponseById(id);

    if (response != null) {
      await database.updateCacheResponse(id, data);
    } else {
      await database.insertCacheResponse(data);
    }
  }
}
