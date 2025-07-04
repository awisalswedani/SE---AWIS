import 'package:flutter/material.dart';
import 'package:flutter_awis_ecommerce/features/location/controllers/location_controller.dart';
import 'package:flutter_awis_ecommerce/features/location/domain/models/prediction_model.dart'
    as prediction_model;
import 'package:flutter_awis_ecommerce/localization/language_constrants.dart';
import 'package:flutter_awis_ecommerce/utill/dimensions.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';

class LocationSearchDialogWidget extends StatelessWidget {
  final GoogleMapController? mapController;
  const LocationSearchDialogWidget({super.key, required this.mapController});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 80),
      alignment: Alignment.topCenter,
      child: Material(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: SizedBox(
            width: 1170,
            child: TypeAheadField(
              builder: (context, controller, focusNode) {
                return TextField(
                    controller: controller,
                    textInputAction: TextInputAction.search,
                    focusNode: focusNode,
                    autofocus: true,
                    textCapitalization: TextCapitalization.words,
                    keyboardType: TextInputType.streetAddress,
                    decoration: InputDecoration(
                        hintText: getTranslated('search_location', context),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(
                                style: BorderStyle.none, width: 0)),
                        hintStyle: Theme.of(context)
                            .textTheme
                            .displayMedium!
                            .copyWith(
                                fontSize: Dimensions.fontSizeDefault,
                                color: Theme.of(context).disabledColor),
                        filled: true,
                        fillColor: Theme.of(context).cardColor),
                    style: Theme.of(context).textTheme.displayMedium!.copyWith(
                        color: Theme.of(context).textTheme.bodyLarge!.color,
                        fontSize: Dimensions.fontSizeLarge));
              },
              suggestionsCallback: (pattern) async {
                if (pattern.isEmpty) {
                  return <prediction_model.Suggestions>[];
                }
                return await Provider.of<LocationController>(context,
                        listen: false)
                    .searchLocation(context, pattern);
              },
              itemBuilder: (context, prediction_model.Suggestions suggestion) {
                return Padding(
                  padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                  child: Row(children: [
                    const Icon(Icons.location_on),
                    Expanded(
                        child: Text(
                            suggestion.placePrediction?.text?.text ?? '',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context)
                                .textTheme
                                .displayMedium!
                                .copyWith(
                                    color: Theme.of(context)
                                        .textTheme
                                        .bodyLarge!
                                        .color,
                                    fontSize: Dimensions.fontSizeLarge))),
                  ]),
                );
              },
              hideOnEmpty: true,
              errorBuilder: (_, value) {
                return const SizedBox();
              },
              onSelected: (prediction_model.Suggestions suggestion) {
                Provider.of<LocationController>(context, listen: false)
                    .setLocation(suggestion.placePrediction?.placeId,
                        suggestion.placePrediction?.text?.text, mapController);
                Navigator.pop(context);
              },
            )),
      ),
    );
  }
}
