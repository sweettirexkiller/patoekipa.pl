import 'dart:js_interop_unsafe';

import 'package:flutter/material.dart';
import 'dart:js' as js;
import 'package:test_portfolio/utils/project_utils.dart';

import '../constants/colors.dart';

class ProjectCardWidget extends StatelessWidget {
  const ProjectCardWidget({super.key, required this.project});

  final ProjectUtils project;

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      height: 280,
      width: 250,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(5),
        color: Colors.blueGrey.shade200,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(
            project.image,
            height: 140,
            width: 250,
            fit: BoxFit.cover,
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
            child: Text(project.title,
                style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white)),
          ),
          // subtitle
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
            child: Text(project.subtitle, style: const TextStyle(fontSize: 10)),
          ),

          const Spacer(),
          // footer
          Container(
            color: Colors.grey,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Row(
              children: [
                const Text(
                  "Available on:",
                  style: TextStyle(
                      color: Colors.black, fontSize: 10),
                ),
                const Spacer(),
                if (project.iosLink != null)
                  Padding(
                      padding: const EdgeInsets.only(left: 6),
                      child: InkWell(
                        onTap: () {
                          js.context.callMethod("open",[project.iosLink]);
                        },
                        child: Image.asset("ios_icon.png", width: 19),
                      )),
                if (project.webLink != null)
                  Padding(
                      padding: const EdgeInsets.only(left: 6),
                      child: InkWell(
                        onTap: () {
                          js.context.callMethod("open",[project.webLink]);

                        },
                        child: Image.asset("web_icon.png", width: 17),
                      )),
                if (project.androidLink != null)
                  Padding(
                      padding: const EdgeInsets.only(left: 6),
                      child: InkWell(
                        onTap: () {
                          js.context.callMethod("open",[project.androidLink]);
                        },
                        child: Image.asset("android_icon.png", width: 17),
                      )),
              ],
            ),
          )
        ],
      ),
    );
  }
}
