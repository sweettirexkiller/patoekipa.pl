import 'package:flutter/material.dart';

import '../constants/colors.dart';

class MainMobile extends StatelessWidget {
  const MainMobile({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;

    return Container(
      height: screenHeight,
      constraints: const BoxConstraints(maxHeight: 500.0),
      margin: const EdgeInsets.symmetric(horizontal: 40.0, vertical: 30.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // avatar img
          ShaderMask(
            shaderCallback: (Rect bounds) {
              return LinearGradient(
                colors: [
                  CustomColor.secondaryColor.withOpacity(0.5),
                  CustomColor.secondaryColor.withOpacity(0.6),
                ],
              ).createShader(bounds);
            },
            blendMode: BlendMode.srcATop,
            child: Image.asset("pato_ikona.png", width: screenWidth / 2),
          ),

          const Text(
            "Cześć, tutaj Patoekipa!\n \nJesteśmy grupa przyjaciół z dzieciństwa, z której wszyscy \n skończyli w IT. \n\n Jesteśmy gotowi do działania!",
            style: TextStyle(
                height: 1.5,
                color: CustomColor.textColor,
                fontSize: 20,
                fontWeight: FontWeight.bold),
          ),
          const SizedBox(
            height: 15,
          ),
          SizedBox(
            width: 190,
            child: ElevatedButton(
                onPressed: () {}, child: const Text("Napisz do nas")),
          )
        ],
      ),
    );
  }
}
