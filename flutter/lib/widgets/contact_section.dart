import 'package:flutter/material.dart';
import 'package:test_portfolio/constants/size.dart';
import 'package:test_portfolio/constants/sns_links.dart';
import 'package:test_portfolio/widgets/custom_textfield.dart';
import 'dart:js' as js;

class ContactSection extends StatelessWidget {
  const ContactSection({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.fromLTRB(25, 20, 25, 60),
        color: Colors.blueGrey,
        child: Column(
          children: [
            const Text(
              "Projekty",
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
                  color: Colors.white),
            ),
            const SizedBox(height: 50),
            ConstrainedBox(
              constraints: const BoxConstraints(
                  maxWidth: 700.0, maxHeight: 100),
              child: LayoutBuilder(
                builder: (context, constraints) {
                  if (constraints.maxWidth < kMinDesktopWidth) {
                    return buildNameEmailFieldMobile();
                  } else {
                    return buildNameEmailFieldDesktop();
                  }
                },
              ),
            ),
            const SizedBox(
              height: 15,
            ),
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 700.0),
              child: const CustomTextfield(
                hintText: "Your message",
                maxLines: 20,
              ),
            ),

            // send button
            const SizedBox(
              height: 15,
            ),
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 700.0),
              child: SizedBox(
                width: double.maxFinite,
                child: ElevatedButton(
                    onPressed: () {}, child: const Text("Get in touch")),
              ),
            ),

            //SNS icon button links
            Padding(
              padding: const EdgeInsets.only(top: 20),
              child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 400.0),
                  child: const Divider()),
            ),

            Wrap(
              spacing: 12,
              runSpacing: 12,
              alignment: WrapAlignment.center,
              children: [
                InkWell(
                    onTap: () {
                      js.context.callMethod("open", [SnsLinks.github]);
                    }, child: Image.asset("github.png", width: 28)),
                InkWell(
                    onTap: () {},
                    child: Image.asset("linkedin.png", width: 28)),
                InkWell(
                    onTap: () {},
                    child: Image.asset("facebook.png", width: 28)),
                InkWell(
                    onTap: () {},
                    child: Image.asset("instagram.png", width: 28)),
              ],
            )
          ],
        ));
  }

  Row buildNameEmailFieldDesktop() {
    return const Row(
      children: [
        Flexible(
            child: CustomTextfield(
              hintText: "Your Name",
            )),
        SizedBox(
          width: 15,
        ),
        Flexible(
            child: CustomTextfield(
              hintText: "Your email",
            )),
      ],
    );
  }

  Column buildNameEmailFieldMobile() {
    return const Column(
      children: [
        Flexible(
            child: CustomTextfield(
              hintText: "Your Name",
            )),
        SizedBox(
          height: 15,
        ),
        Flexible(
            child: CustomTextfield(
              hintText: "Your email",
            )),
      ],
    );
  }
}
