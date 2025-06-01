import 'package:flutter/material.dart';

import '../constants/skill_items.dart';

class SkillsDesktop extends StatelessWidget {
  SkillsDesktop({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;

    return Container(
      width: screenWidth,
      padding: const EdgeInsets.fromLTRB(25, 20, 25, 60),
      color: Colors.blueGrey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // title
          const Text(
            "Członkowie i zdolności",
            style: TextStyle(
                fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(
            height: 30,
          ),
          // platforms and skills
          // a Row of icons of people
         Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              spacing: 20,
              children: [
                for (int i = 0; i < 7; i++)
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.person,
                          color: Colors.blueGrey.shade700,
                          size: 30,
                        ),
                        const SizedBox(height: 5),
                        Text(
                          "Name $i", // Replace with actual names if available
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.blueGrey.shade700,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(
            height: 30,
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // platforms
              Flexible(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 450.0),
                  child: Wrap(
                    spacing: 5,
                    runSpacing: 5,
                    children: [
                      for (int i = 0; i < platformItems.length; i++)
                        Container(
                            width: 200,
                            decoration: BoxDecoration(
                              color: Colors.blueGrey.shade200,
                              borderRadius: BorderRadius.circular(5),
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 20.0, vertical: 10.0),
                              leading: Image.asset(platformItems[i]["img"],
                                  width: 26),
                              title: Text(platformItems[i]["title"]),
                            ))
                    ],
                  ),
                ),
              ),
              const SizedBox(
                width: 50,
              ),
              // skills
              Flexible(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 450.0),
                  child: Wrap(
                    children: [
                      for (int i = 0; i < skillItems.length; i++)
                        Chip(
                          label: Text(skillItems[i]["title"]),
                          avatar: Image.asset(skillItems[i]["img"]),
                        )
                    ],
                  ),
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}
