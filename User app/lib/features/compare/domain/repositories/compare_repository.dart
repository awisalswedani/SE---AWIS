import 'package:flutter_awis_ecommerce/data/datasource/remote/dio/dio_client.dart';
import 'package:flutter_awis_ecommerce/data/datasource/remote/exception/api_error_handler.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/features/compare/domain/repositories/compare_repository_interface.dart';
import 'package:flutter_awis_ecommerce/utill/app_constants.dart';

class CompareRepository implements CompareRepositoryInterface {
  final DioClient? dioClient;
  CompareRepository({required this.dioClient});

  @override
  Future<ApiResponseModel> getList({int? offset}) async {
    try {
      final response = await dioClient!.get(AppConstants.getCompareList);
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> addCompareProductList(int id) async {
    try {
      final response = await dioClient!
          .post(AppConstants.addToCompareList, data: {'product_id': id});
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> removeAllCompareProductList() async {
    try {
      final response = await dioClient!.post(
          AppConstants.removeAllFromCompareList,
          data: {'_method': 'delete'});
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> replaceCompareProductList(
      int compareId, int productId) async {
    try {
      final response = await dioClient!.get(
          '${AppConstants.replaceFromCompareList}?compare_id=$compareId&product_id=$productId');
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> getAttributeList() async {
    try {
      final response = await dioClient!.get(AppConstants.attributeUri);
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future add(value) {
    // TODO: implement add
    throw UnimplementedError();
  }

  @override
  Future delete(int id) {
    // TODO: implement delete
    throw UnimplementedError();
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
