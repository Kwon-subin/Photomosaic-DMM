import 'package:flutter/material.dart';
import '../../../constants/color_constant.dart';

class MyTextButton extends StatelessWidget {
  const MyTextButton({
    Key? key,
    required this.buttonName,
    required this.onTap,
    required this.bgColor,
    required this.textColor,
  }) : super(key: key);
  final String buttonName;
  final Function onTap;
  final Color bgColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      width: MediaQuery.of(context).size.width * 0.5,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(18),
      ),
      child: TextButton(
        style: ButtonStyle(
          overlayColor: MaterialStateProperty.resolveWith(
            (states) => Colors.black12,
          ),
        ),
        onPressed: onTap as void Function()?,
        child: Text(
          buttonName,
          style: kButtonText.copyWith(color: textColor),
        ),
      ),
    );
  }
}
