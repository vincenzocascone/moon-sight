import dayjs from "dayjs";

import Experience from "../Experience";
import EventEmitter from "../utils/EventEmitter";

interface CurrentDate {
  year: number;
  month: number;
  day: number;
}

export default class MoonData extends EventEmitter {
  private currentDate: CurrentDate;
  private debugFolder: any;
  daysIntoCycle!: number;
  phaseName!: string;
  prevPhaseName!: string;
  rotationDegrees!: number;
  fullDate!: string;

  constructor() {
    super();

    this.currentDate = {
      year: dayjs().year(),
      month: dayjs().month() + 1,
      day: dayjs().date(),
    };

    this.updateData();
    this.setDebug();
  }

  updateData(): void {
    this.getDaysIntoCycle();
    this.getPhaseName();
    this.getRotationDegrees();
    this.getFullDate();
  }

  private setDebug(): void {
    const { debugUi } = Experience.getInstance();

    if (debugUi.active) {
      this.debugFolder = debugUi.ui?.addFolder("Time");

      this.debugFolder.add(this.currentDate, "day").min(1).max(31).step(1);

      this.debugFolder.add(this.currentDate, "month").min(1).max(12).step(1);

      this.debugFolder
        .add(this.currentDate, "year")
        .min(2000)
        .max(2050)
        .step(1);
    }

    if (debugUi.active) {
      debugUi.ui?.onChange((event: any) => {
        if (
          event.property == "day" ||
          event.property == "month" ||
          event.property == "year"
        ) {
          this.updateData();
          this.trigger("newDate");
        }
      });
    }
  }

  private getDaysIntoCycle(): void {
    const daysSinceNew = dayjs(
      this.currentDate.year +
        "-" +
        this.currentDate.month +
        "-" +
        this.currentDate.day
    ).diff("2000-01-6", "days");

    const cycles = daysSinceNew / 29.53058770576;

    this.daysIntoCycle = (cycles % 1) * 29.53058770576;
  }

  private getPhaseName(): void {
    this.prevPhaseName = this.phaseName;

    if (0 < this.daysIntoCycle && this.daysIntoCycle <= 1) {
      this.phaseName = "New Moon";
    }
    if (this.daysIntoCycle > 1 && this.daysIntoCycle <= 6.382647) {
      this.phaseName = "Waxing Crescent";
    }
    if (this.daysIntoCycle > 6.382647 && this.daysIntoCycle <= 8.382647) {
      this.phaseName = "First Quarter";
    }
    if (this.daysIntoCycle > 8.382647 && this.daysIntoCycle <= 13.765294) {
      this.phaseName = "Waxing Gibbous";
    }
    if (this.daysIntoCycle > 13.765294 && this.daysIntoCycle <= 15.765294) {
      this.phaseName = "Full Moon";
    }
    if (this.daysIntoCycle > 15.765294 && this.daysIntoCycle <= 21.147941) {
      this.phaseName = "Waning Gibbous";
    }
    if (this.daysIntoCycle > 21.147941 && this.daysIntoCycle <= 23.147941) {
      this.phaseName = "Third Quarter";
    }
    if (this.daysIntoCycle > 23.147941 && this.daysIntoCycle <= 28.530588) {
      this.phaseName = "Waning Crescent";
    }
    if (this.daysIntoCycle > 28.530588 && this.daysIntoCycle <= 29.530588) {
      this.phaseName = "New Moon";
    }
  }

  private getRotationDegrees(): void {
    this.rotationDegrees =
      (this.daysIntoCycle * Math.PI * 2) / 29.53 - Math.PI / 2;
  }

  private getFullDate(): void {
    this.fullDate = dayjs(
      this.currentDate.year +
        "-" +
        this.currentDate.month +
        "-" +
        this.currentDate.day
    ).format("D MMM YYYY");
  }

  public nextDay(): void {
    const newDate = dayjs(
      this.currentDate.year +
        "-" +
        this.currentDate.month +
        "-" +
        this.currentDate.day
    ).add(1, "day");
    this.currentDate.day = newDate.date();
    this.currentDate.month = newDate.month() + 1;
    this.currentDate.year = newDate.year();
    this.updateData();
  }

  public prevDay(): void {
    const newDate = dayjs(
      this.currentDate.year +
        "-" +
        this.currentDate.month +
        "-" +
        this.currentDate.day
    ).subtract(1, "day");
    this.currentDate.day = newDate.date();
    this.currentDate.month = newDate.month() + 1;
    this.currentDate.year = newDate.year();
    this.updateData();
  }
}
