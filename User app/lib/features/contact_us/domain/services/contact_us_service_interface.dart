import 'package:flutter_awis_ecommerce/features/contact_us/domain/models/contact_us_body.dart';

abstract class ContactUsServiceInterface {
  Future<dynamic> add(ContactUsBody contactUsBody);
}
