import 'package:flutter_test/flutter_test.dart';
import 'package:christian_matrimony_mobile/main.dart';

void main() {
  testWidgets('App initialization test', (WidgetTester tester) async {
    await tester.pumpWidget(const ChristianMatrimonyApp());
    expect(find.byType(ChristianMatrimonyApp), findsOneWidget);
  });
}
