
import 'package:flutter/material.dart';
import 'package:test_portfolio/widgets/project_card.dart';

import '../utils/project_utils.dart';

class ProjectsSection extends StatelessWidget {
  const ProjectsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;

    return  Container(
        width: screenWidth,
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20),
        child: Column(
          children: <Widget>[
            // work projects title
            const Text(
              "Work projects",
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.blueGrey),
            ),
            const SizedBox(height: 50,),
            // work project cards
            ConstrainedBox(
              constraints: const BoxConstraints(
                  maxWidth: 800
              ),
              child: Wrap(
                spacing: 10,
                runSpacing: 25,
                children: [
                  for (int i = 0; i < workProjectUtils.length; i++)
                    ProjectCardWidget(
                      project: workProjectUtils[i],
                    ),
                ],
              ),
            ),
            const SizedBox(height: 80,),

            const Text(
              "Hobby projects",
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.blueGrey),
            ),
            const SizedBox(height: 50,),
            // work project cards
            ConstrainedBox(
              constraints: const BoxConstraints(
                  maxWidth: 800
              ),
              child: Wrap(
                spacing: 10,
                runSpacing: 25,
                children: [
                  for (int i = 0; i < hobbyProjectUtils.length; i++)
                    ProjectCardWidget(
                      project: hobbyProjectUtils[i],
                    ),
                ],
              ),
            )
          ],
        ));
  }
}