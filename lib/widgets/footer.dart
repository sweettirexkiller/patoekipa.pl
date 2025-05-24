import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  const Footer({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding:
      const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
      height: 200,
      width: double.maxFinite,
      alignment: Alignment.center,
      child: const Text(
        "© 2025 All rights reserved. Made by Piotr Jankiewicz",
        textAlign: TextAlign.center,
        style: TextStyle(
          color: Colors.black,
          fontSize: 16,
          fontWeight: FontWeight.w400,
        ),
      ),
    );
  }
}
