import 'package:flutter/material.dart';

import '../constants/colors.dart';

BoxDecoration kHeaderDecoration = BoxDecoration(
    gradient: const LinearGradient(
        colors: [
          CustomColor.primaryColor,
          CustomColor.secondaryColor
        ]
    ),
    borderRadius: BorderRadius.circular(10)
);
