# Alarm Clock CLI

This is a command-line interface (CLI) program for an alarm clock, implemented using JavaScript and Node Js. It allows users to set alarms, snooze them, and view the current time, all through a simple menu-driven interface.

## Features

- Display the current time.
- Add an alarm for a specific time and day of the week.
- Start and stop the alarm clock.
- Show all set alarms.
- Snooze alarms with a maximum of three snoozes.
- Delete alarms.

## Prerequisites

- Node Js

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jaswalsaurabh/alarm-clock-main
    ```

## Usage

1. Run the program:

    ```bash
    node clock.js
    ```

2. Follow the on-screen menu to interact with the alarm clock.

### Menu Options

1. **Display Current Time**: Shows the current time and day.
2. **Add Alarm**: Prompts for time and day to set a new alarm.
3. **Start Alarm Clock**: Starts the alarm clock, checking alarms every 5 seconds.
4. **Stop Alarm Clock**: Stops the alarm clock.
5. **Show All Alarms**: Displays all currently set alarms.
6. **Snooze Alarm**: Snoozes an alarm for 5 mins, with a maximum of three snoozes.
7. **Delete Alarm**: Deletes a specified alarm.
8. **Exit**: Exits the program.

### Scheduling an Alarm

1. Select the **Add Alarm** menu by entering `2`.
2. Enter the alarm time in the format `HH:MM AM/PM` (e.g., `08:30 AM`).
3. Enter the number of the day of the week from `1` to `7` (where `1` is Monday and `7` is Sunday), and press Enter.
4. Your alarm is now scheduled

Note: To check if the alarm should ring, you need to start the alarm clock.

### Deleting an Alarm

1. To delete an alarm, first select the **Show All Alarms** menu by entering `5`. This will display a list of all set alarms with their indices.
2. Note the index number of the alarm you want to delete. The index starts from `1` and goes up to the length of the alarms array.
3. Select the **Delete Alarm** menu by entering `7`.
4. Enter the index number of the alarm you want to delete and press Enter.
5. The specified alarm will be deleted from the list.
