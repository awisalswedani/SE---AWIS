import 'dart:io';

import 'package:flutter_awis_ecommerce/features/profile/domain/models/profile_model.dart';
import 'package:flutter_awis_ecommerce/interface/repo_interface.dart';

abstract class ProfileRepositoryInterface implements RepositoryInterface {
  Future<dynamic> getProfileInfo();
  Future<dynamic> updateProfile(
      ProfileModel userInfoModel, String pass, File? file, String token);
}
