import 'package:flutter/material.dart';
import 'package:validate_tickets/pages/home.dart';

void main() {
  runApp(const ValidateTicketsApp());
}

class ValidateTicketsApp extends StatelessWidget {
  const ValidateTicketsApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Validate Tickets',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomePage(),
    );
  }
}
