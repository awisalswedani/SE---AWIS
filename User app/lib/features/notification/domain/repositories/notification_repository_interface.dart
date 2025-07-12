import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class NotificationRepositoryInterface implements RepositoryInterface {
  Future<dynamic> seenNotification(int id);
}
