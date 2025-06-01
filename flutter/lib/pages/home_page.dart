import 'dart:ui';
import 'dart:js' as js;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';
import 'package:test_portfolio/constants/colors.dart';
import 'package:test_portfolio/constants/skill_items.dart';
import 'package:test_portfolio/constants/sns_links.dart';
import 'package:test_portfolio/utils/project_utils.dart';
import 'package:test_portfolio/widgets/custom_textfield.dart';
import 'package:test_portfolio/widgets/header_desktop.dart';
import 'package:test_portfolio/widgets/main_desktop.dart';
import 'package:test_portfolio/widgets/skills_desktop.dart';

import '../constants/size.dart';
import '../widgets/contact_section.dart';
import '../widgets/drawer_mobile.dart';
import '../widgets/footer.dart';
import '../widgets/header_mobile.dart';
import '../widgets/main_mobile.dart';
import '../widgets/project_card.dart';
import '../widgets/projects_section.dart';
import '../widgets/skills_mobile.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  final scrollController = ScrollController();
  final List<GlobalKey> navKeys = List.generate(4, (_) => GlobalKey());

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;

    return LayoutBuilder(
      builder: (context, constraints) {
        return Scaffold(
            key: scaffoldKey,
            backgroundColor: CustomColor.backgroundColor,
            endDrawer: constraints.maxWidth >= kMinDesktopWidth
                ? null
                : DrawerMobile(
                    onNavTap: (int navIndex) {
                      scaffoldKey.currentState?.closeEndDrawer();
                      scrollToSection(navIndex);
                    },
                  ),
            body: SingleChildScrollView(
              controller: scrollController,
              scrollDirection: Axis.vertical,
              child: Column(
                children: [
                  // MAIN
                  SizedBox(
                    key: navKeys.first,
                  ),
                  if (constraints.maxWidth >= kMinDesktopWidth)
                    HeaderDesktop(
                      onNavTap: (int navIndex) {
                        scrollToSection(navIndex);
                      },
                    )
                  else
                    HeaderMobile(
                      onLogoTap: () {},
                      onMenuTap: () {
                        scaffoldKey.currentState?.openEndDrawer();
                      },
                    ),
                  //
                  // const MainDesktop(),

                  if (constraints.maxWidth >= kMinDesktopWidth)
                    const MainDesktop()
                  else
                    const MainMobile(),
                  // SKILLS
                  if (constraints.maxWidth >= kMinDesktopWidth)
                    SkillsDesktop(key: navKeys[1])
                  else
                    SkillsMobile(key: navKeys[1]),

                  // PROJECTS
                  ProjectsSection(key: navKeys[2]),
                  // CONTACT
                  ContactSection(key: navKeys[3]),
                  // FOOTER
                  const Footer(),
                ],
              ),
            ));
      },
    );
  }

  void scrollToSection(int index) {
    if(index == 4){
      // open blog page
      js.context.callMethod('open', [SnsLinks.blog]);
    }
    if (index < 0 || index >= navKeys.length) return;
    final key = navKeys[index];
    final context = key.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(context,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut);
    }
  }
}
