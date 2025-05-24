import 'package:flutter/material.dart';
import '../constants/colors.dart';

class SiteLogo extends StatelessWidget {
  const SiteLogo({super.key, this.onTap});
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: const Padding(
        padding: EdgeInsets.only(left: 20),
        child: Text(
          'PJ',
          style: TextStyle(
            color: CustomColor.secondaryColor,
            fontWeight: FontWeight.w500,
            fontSize: 20,
            decoration: TextDecoration.underline,
          ),
        ),
      ),
    );
  }
}
