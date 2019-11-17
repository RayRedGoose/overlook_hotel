import {expect} from 'chai';
import Days from '../src/js/Days';
import dataset from './test-data/mock-data';

describe("Days", () => {
  beforeEach(() => {
    Days.findAllDays(dataset.bookings);
  });

  it("should be function", () => {
    expect(Days).to.be.a('function');
  });

  it("should find all days", () => {
    expect(Days.allDays).to.deep.equal([
      "2019/10/23",
      "2019/11/20",
      "2019/11/21"
    ]);
  });

  it("should find today", () => {
    Days.findToday();
    expect(Days.today).to.equal('2019/11/21');
  });

  it("should find triple of last days", () => {
    Days.findToday();
    let tripleDays = Days.findTripleDays();
    expect(tripleDays).to.deep.equal([
      "2019/10/23",
      "2019/11/20",
      "2019/11/21"
    ]);
  });

  it("should find all past days", () => {
    Days.findToday();
    let pastDays = Days.findPastDays();
    expect(pastDays).to.deep.equal([
      "2019/10/23",
      "2019/11/20"
    ]);
  });

  it("should find all future days", () => {
    Days.today = '2019/11/20';
    let futureDays = Days.findFutureDays();
    expect(futureDays).to.deep.equal([
      "2019/11/21"
    ]);
  });
});
