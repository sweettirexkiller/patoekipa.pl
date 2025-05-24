import 'package:flutter/material.dart';

import '../constants/colors.dart';

class MainDesktop extends StatelessWidget {
  const MainDesktop({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;

    return Container(
        margin: const EdgeInsets.symmetric(horizontal: 20.0),
        height: screenHeight / 1.2,
        constraints: const BoxConstraints(minHeight: 350.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset("pato_ikona.png", width: screenWidth / 3),
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
                  width: 250,
                  child: ElevatedButton(
                      onPressed: () {}, child: const Text("Napisz do nas")),
                )
              ],
            ),
          ],
        ));
  }
}
