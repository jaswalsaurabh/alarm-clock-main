const readline = require("readline");

class Alarm {
  constructor(time, day) {
    this.time = time;
    this.day = day;
    this.snoozed = false;
    this.snoozeCount = 0;
    this.snoozeTimeoutId = null;
    this.rung = false;
  }
}

class AlarmClock {
  constructor() {
    this.alarms = [];
    this.intervalId = null;
    this.snoozeInterval = 120;
  }

  static formatInputTime(time) {
    let [hour, minutePeriod] = time.split(":");
    let [minute, period] = minutePeriod.split(" ");
    if (hour.length < 2) {
      hour = "0" + hour;
    }
    if (minute.length < 2) {
      minute = "0" + minute;
    }
    return `${hour}:${minute}:00 ${period}`;
  }

  static formatTime(date) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }
  static isValidTimeFormat(time) {
    const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    return timePattern.test(time);
  }

  static getDayString(dayNumber) {
    const dayMapping = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };
    return dayMapping[dayNumber];
  }

  static getTimestamp(timeString) {
    const now = new Date();
    const [time, period] = timeString.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);

    return now.getTime();
  }

  updateAlarmTime(secondsToAdd) {
    if (secondsToAdd < 0) secondsToAdd = 0;

    const now = new Date();

    now.setSeconds(now.getSeconds() + secondsToAdd);

    return AlarmClock.formatTime(now);
  }

  displayCurrentTime() {
    const now = new Date();
    const timeString = AlarmClock.formatTime(now);
    const dayString = now.toLocaleDateString("en-US", { weekday: "long" });
    console.log(`Current time: ${timeString}, ${dayString}`);
  }

  addAlarm(time, day) {
    const alarm = new Alarm(time, day);
    this.alarms.push(alarm);
    console.log(`Alarm set for ${time} on ${day}`);
  }

  checkAlarms() {
    const now = new Date();
    const currentTime = AlarmClock.formatTime(now);
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });

    this.alarms.forEach((alarm) => {
      if (
        currentTime >= alarm.time &&
        alarm.day === currentDay &&
        !alarm.snoozed &&
        !alarm.rung
      ) {
        console.log(`ALARM ringing! It's ${alarm.time} on ${alarm.day}`);
        alarm.rung = true;
      }
    });
  }

  snoozeAlarm(id) {
    if (id < 0 || id > this.alarms.length) {
      console.log("Invalid alarm index");
      return;
    }
    const index = id - 1;
    let myalarm = this.alarms[index];
    const now = new Date().getTime();
    const alarmTime = AlarmClock.getTimestamp(myalarm.time);
    const snoozeActiveTime = alarmTime + this.snoozeInterval * 1000;
    if (now >= snoozeActiveTime) {
      if (myalarm.snoozeCount < 3) {
        myalarm.snoozed = true;
        myalarm.rung = false;
        myalarm.time = this.updateAlarmTime(this.snoozeInterval);
        myalarm.snoozeCount += 1;
        console.log(
          `Alarm for ${myalarm.time} on ${myalarm.day} has been snoozed and will alert again in 20s.`
        );
        this.alarms[index] = myalarm;
        if (myalarm.snoozeTimeoutId) {
          clearTimeout(myalarm.snoozeTimeoutId);
        }
        myalarm.snoozeTimeoutId = setTimeout(() => {
          myalarm.snoozed = false;
          myalarm.snoozeTimeoutId = null;
        }, this.snoozeInterval * 1000);
      } else {
        console.log(
          `Alarm for ${myalarm.time} on ${myalarm.day} has been canceled after 3 snoozes.`
        );
        this.deleteAlarm(id);
      }
    } else {
      console.log(
        `You cannot snooze yet. Please wait until the snooze interval is over.`
      );
    }
  }

  deleteAlarm(id) {
    if (id < 0 || id > this.alarms.length) {
      console.log("invalid index");
      return;
    }
    const index = id - 1;
    let alarm = this.alarms[index];
    console.log(`Alarm for ${alarm.time} on ${alarm.day} has been removed.`);
    this.alarms.splice(index, 1);
  }

  startClock() {
    this.intervalId = setInterval(() => {
      this.displayCurrentTime();
      this.checkAlarms();
    }, 5000);
  }

  stopClock() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  showAllAlarms() {
    if (this.alarms.length === 0) {
      console.log("No alarms set.");
      return;
    }
    console.log("Current Alarms:");
    console.log("Index. Alarm");
    this.alarms.forEach((alarm, index) => {
      console.log(`${index + 1}. Time: ${alarm.time}, Day: ${alarm.day}`);
    });
  }
}

const alarmClock = new AlarmClock();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = () => {
  console.log("\nMenu:");
  console.log("1. Display Current Time");
  console.log("2. Add Alarm");
  console.log("3. Start Alarm Clock");
  console.log("4. Stop Alarm Clock");
  console.log("5. Show All Alarms");
  console.log("6. Snooze Alarm");
  console.log("7. Delete Alarm");
  console.log("8. Exit");
  rl.question("Choose an option: ", (option) => {
    switch (option) {
      case "1":
        alarmClock.displayCurrentTime();
        menu();
        break;
      case "2":
        rl.question("Enter alarm time (HH:MM AM/PM): ", (time) => {
          if (!AlarmClock.isValidTimeFormat(time)) {
            console.log(
              "Invalid time format. Please enter time in HH:MM AM/PM format."
            );
            menu();
            return;
          }
          console.log("Enter day of the week: ");
          console.log("1. Monday");
          console.log("2. Tuesday");
          console.log("3. Wednesday");
          console.log("4. Thursday");
          console.log("5. Friday");
          console.log("6. Saturday");
          console.log("7. Sunday");
          rl.question("Choose a day (1-7): ", (dayNumber) => {
            const day = AlarmClock.getDayString(Number(dayNumber));
            const formttedTime = AlarmClock.formatInputTime(time);
            if (day) {
              alarmClock.addAlarm(formttedTime, day);
              menu();
            } else {
              console.log("Invalid day number. Please try again.");
              menu();
            }
          });
        });
        break;
      case "3":
        alarmClock.startClock();
        console.log("Alarm clock started.");
        menu();
        break;
      case "4":
        alarmClock.stopClock();
        console.log("Alarm clock stopped.");
        menu();
        break;
      case "5":
        alarmClock.showAllAlarms();
        menu();
        break;
      case "6":
        rl.question("Snooze the alarm (index): ", (index) => {
          alarmClock.snoozeAlarm(index);
          menu();
        });
        break;
      case "7":
        rl.question("Delete alarm (index): ", (index) => {
          alarmClock.deleteAlarm(index);
          menu();
        });
        break;
      case "8":
        alarmClock.stopClock();
        rl.close();
        break;
      default:
        console.log("Invalid option. Please try again.");
        menu();
    }
  });
};

menu();
