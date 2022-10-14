# validate_tickets

### Running

To be able to run on the local network you need to do the following:
- When using `flutter run` add the args: `--web-port 8080 --web-hostname <YOUR DEVICE'S IP>`
- Create a `.vscode/launch.json` file w/ the contents:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "validate_tickets (debug mode)",
      "cwd": "validate_tickets",
      "request": "launch",
      "type": "dart",
      "args": ["--web-port", "8080", "--web-hostname", "YOUR DEVICE'S IP"]
    },
    {
      "name": "validate_tickets (profile mode)",
      "cwd": "validate_tickets",
      "request": "launch",
      "type": "dart",
      "flutterMode": "profile",
      "args": ["--web-port", "8080", "--web-hostname", "YOUR DEVICE'S IP"]
    },
    {
      "name": "validate_tickets (release mode)",
      "cwd": "validate_tickets",
      "request": "launch",
      "type": "dart",
      "flutterMode": "release",
      "args": ["--web-port", "8080", "--web-hostname", "YOUR DEVICE'S IP"]
    }
  ]
}
```
