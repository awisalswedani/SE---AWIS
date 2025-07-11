import 'package:dio/dio.dart';
import 'package:flutter_awis_ecommerce/data/datasource/remote/dio/dio_client.dart';
import 'package:flutter_awis_ecommerce/data/datasource/remote/exception/api_error_handler.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/features/location/domain/repositories/location_repository_interface.dart';
import 'package:flutter_awis_ecommerce/utill/app_constants.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class LocationRepository implements LocationRepositoryInterface {
  final DioClient? dioClient;
  LocationRepository({
    this.dioClient,
  });

  @override
  Future<ApiResponseModel> getAddressFromGeocode(LatLng latLng) async {
    try {
      Response response = await dioClient!.get(
          '${AppConstants.geocodeUri}?lat=${latLng.latitude}&lng=${latLng.longitude}');
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> searchLocation(String text) async {
    try {
      Response response = await dioClient!
          .get('${AppConstants.searchLocationUri}?search_text=$text');
      return ApiResponseModel.withSuccess(response);
    } catch (e) {
      return ApiResponseModel.withError(ApiErrorHandler.getMessage(e));
    }
  }

  @override
  Future<ApiResponseModel> getPlaceDetails(String? placeID) async {
    try {
      Response response = await dioClient!
          .get('${AppConstants.placeDetailsUri}?placeid=$placeID');
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
  Future getList({int? offset = 1}) {
    // TODO: implement getList
    throw UnimplementedError();
  }

  @override
  Future update(Map<String, dynamic> body, int id) {
    // TODO: implement update
    throw UnimplementedError();
  }
}
