import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class ReOrderRepositoryInterface<T> extends RepositoryInterface {
  Future<dynamic> reorder(String orderId);
}
