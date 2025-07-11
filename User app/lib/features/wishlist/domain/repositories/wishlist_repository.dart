import 'package:flutter_awis_ecommerce/data/datasource/remote/dio/dio_client.dart';
import 'package:flutter_awis_ecommerce/data/datasource/remote/exception/api_error_handler.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/features/wishlist/domain/repositories/wishlist_repository_interface.dart';
import 'package:flutter_awis_ecommerce/utill/app_constants.dart';

class WishListRepository implements WishListRepositoryInterface {
  final DioClient? dioClient;

  WishListRepository({required this.dioClient});

  @override
  Future<ApiResponseModel> getList({int? offset = 1}) async {
    try {
      final response = await dioClient!.get(AppConstants.getWishListUri);
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> add(int productID) async {
    try {
      final response = await dioClient!
          .post(AppConstants.addWishListUri + productID.toString());
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> delete(int productID) async {
    try {
      final response = await dioClient!
          .delete(AppConstants.removeWishListUri + productID.toString());
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future get(String id) {
    // TODO: implement get
    throw UnimplementedError();
  }

  @override
  Future update(Map<String, dynamic> body, int id) {
    // TODO: implement update
    throw UnimplementedError();
  }
}
