import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../constants/nav_items.dart';


class DrawerMobile extends StatelessWidget {
  const DrawerMobile({super.key, required this.onNavTap});
  final Function(int) onNavTap;

  @override
  Widget build(BuildContext context) {
    return Drawer(
        backgroundColor: CustomColor.secondaryColor,
        child: ListView(
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: Padding(
                  padding:
                  const EdgeInsets.only(top: 20, left: 20, bottom: 20),
                  child: IconButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      icon: const Icon(
                        Icons.close,
                        color: Colors.white,
                      ))),
            ),
            for (int i = 0; i < navTitles.length; i++)
              ListTile(
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: 30, vertical: 10),
                leading: Icon(navIcons[i]),
                onTap: (){onNavTap(i);},
                title: Text(
                  navTitles[i],
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
              )
          ],
        ));
  }
}







