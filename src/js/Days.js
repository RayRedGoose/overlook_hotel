class Days {
  constructor() {
    this.allDays = null;
    this.today = null;
  }

  static findAllDays(dataset) {
    const days = dataset.reduce((dates, data) => {
        if (!dates.includes(data.date)) {
          dates.push(data.date);
        }
        return dates;
      }, []).sort();
    Days.allDays = days;
  }

  static findToday() {
    let index = Math.floor(Math.random() * (this.allDays.length - 2)) + 2;
    Days.today = Days.allDays[index];
  }

  static findTripleDays() {
    let index = Days.allDays.indexOf(this.today);
    return Days.allDays.reduce((days, day, ind) => {
      if (ind === index || ind === index - 1 || ind === index - 2) {
        days.push(day);
      }
      return days;
    }, []);
  }

  static findPastDays() {
    let index = Days.allDays.indexOf(this.today);
    return Days.allDays.reduce((days, day, ind) => {
      if (ind < index) {
        days.push(day);
      }
      return days;
    }, []);
  }

  static findFutureDays() {
    let index = Days.allDays.indexOf(this.today);
    return Days.allDays.reduce((futureDays, day, ind) => {
      if (ind > index) {
        futureDays.push(day);
      }
      return futureDays;
    }, []);
  }
}


export default Days;
