import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/common/enums/data_source_enum.dart';
import 'package:flutter_awis_ecommerce/data/model/api_response.dart';
import 'package:flutter_awis_ecommerce/features/brand/domain/models/brand_model.dart';
import 'package:flutter_awis_ecommerce/features/brand/domain/repositories/brand_repository.dart';
import 'package:flutter_awis_ecommerce/helper/data_sync_helper.dart';

class BrandController extends ChangeNotifier {
  final BrandRepository? brandRepo;
  BrandController({required this.brandRepo});

  Brand? _brandModel;
  Brand? _sellerWiseBrandModel;
  Brand? get brandModel => _brandModel;
  Brand? get sellerWiseBrandModel => _sellerWiseBrandModel;

  List<BrandModel> _brandList = [];
  List<BrandModel> get brandList => _brandList;

  Future<void> getBrandList({required int offset, bool isUpdate = true}) async {
    if (offset == 1) {
      _brandModel = null;

      if (isUpdate) {
        notifyListeners();
      }
    }

    if (offset == 1) {
      DataSyncHelper.fetchAndSyncData(
        fetchFromLocal: () => brandRepo!
            .getBrandList(offset: offset, source: DataSourceEnum.local),
        fetchFromClient: () => brandRepo!
            .getBrandList(offset: offset, source: DataSourceEnum.client),
        onResponse: (data, source) {
          _brandModel = Brand.fromJson(data);

          // onUpdateFiltererBrandList(isSeller: false);

          notifyListeners();
        },
      );
    } else {
      final ApiResponseModel apiResponse = await brandRepo!
          .getBrandList(offset: offset, source: DataSourceEnum.client);

      if (apiResponse.response?.statusCode == 200) {
        final Brand parsedBrand = Brand.fromJson(apiResponse.response?.data);

        _brandModel?.offset = parsedBrand.offset;
        _brandModel?.limit = parsedBrand.limit;
        _brandModel?.brands?.addAll(parsedBrand.brands ?? []);

        // onUpdateFiltererBrandList(isSeller: false);

        notifyListeners();
      }
    }
  }

  Future<void> getSellerWiseBrandList(int sellerId) async {
    ApiResponseModel apiResponse =
        await brandRepo!.getSellerWiseBrandList(sellerId);

    if (apiResponse.response?.statusCode == 200) {
      _sellerWiseBrandModel = Brand.fromJson(apiResponse.response?.data);

      onUpdateFiltererBrandList(isSeller: true);
    }

    notifyListeners();
  }

  final List<int> _selectedBrandIds = [];
  List<int> get selectedBrandIds => _selectedBrandIds;

  void onUpdateFiltererBrandList({required bool isSeller}) {
    _brandList.clear();
    _brandList.addAll(isSeller
        ? _sellerWiseBrandModel?.brands ?? []
        : _brandModel?.brands ?? []);
  }

  void checkedToggleBrand(int index) {
    _brandList[index].checked = !_brandList[index].checked!;

    if (_brandList[index].checked ?? false) {
      if (!_selectedBrandIds.contains(index)) {
        _selectedBrandIds.add(index);
      }
    } else {
      _selectedBrandIds.remove(index);
    }
    notifyListeners();
  }

  bool isTopBrand = true;
  bool isAZ = false;
  bool isZA = false;

  void sortBrandLis(int value) {
    if (value == 0) {
      _brandList.clear();
      _brandList.addAll(brandModel?.brands ?? []);
      isTopBrand = true;
      isAZ = false;
      isZA = false;
    } else if (value == 1) {
      _brandList.clear();
      _brandList.addAll(brandModel?.brands ?? []);
      _brandList.sort(
          (a, b) => a.name!.toLowerCase().compareTo(b.name!.toLowerCase()));
      isTopBrand = false;
      isAZ = true;
      isZA = false;
    } else if (value == 2) {
      _brandList.clear();
      _brandList.addAll(brandModel?.brands ?? []);
      _brandList.sort(
          (a, b) => a.name!.toLowerCase().compareTo(b.name!.toLowerCase()));
      Iterable iterable = _brandList.reversed;
      _brandList = iterable.toList() as List<BrandModel>;
      isTopBrand = false;
      isAZ = false;
      isZA = true;
    }

    notifyListeners();
  }
}
