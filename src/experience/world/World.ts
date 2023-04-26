import DateText from "./DateText";
import Environment from "./Environment";
import Moon from "./Moon";
import MoonData from "./MoonData";
import NextDayButton from "./NextDayButton";
import PhaseText from "./PhaseText";
import PrevDayButton from "./PrevDayButton";
import Stars from "./Stars";
import Experience from "../Experience";

export default class World {
  private static instance: World | null = null;
  moonData: MoonData;
  moon: Moon;
  phaseText: PhaseText;
  dateText: DateText;
  nextDayButton: NextDayButton;
  prevDayButton: PrevDayButton;
  stars: Stars;
  environment: Environment;

  private constructor() {
    if (World.instance) {
      return World.instance;
    }
    World.instance = this;

    const { resourcesManager } = Experience.getInstance();

    this.moonData = new MoonData();

    // Wait for resources loading
    resourcesManager.on("ready", () => {
      this.moon = new Moon();
      this.phaseText = new PhaseText();
      this.dateText = new DateText();
      this.nextDayButton = new NextDayButton();
      this.prevDayButton = new PrevDayButton();
      this.stars = new Stars();
      this.environment = new Environment();

      // New Date event
      this.moonData.on("newDate", () => {
        this.updateData();
      });

      // Previous Day event
      this.prevDayButton.on("prevDay", () => {
        this.prevDay();
      });

      // Next Day event
      this.nextDayButton.on("nextDay", () => {
        this.nextDay();
      });
    });
  }

  static getInstance(): World {
    if (!World.instance) {
      World.instance = new World();
    }
    return World.instance;
  }

  updateData(): void {
    this.phaseText.updateData();
    this.environment.updateData();
    this.dateText.updateData();
  }

  resize(): void {
    this.phaseText.resize();
    this.dateText.resize();
    this.moon.resize();
    this.prevDayButton.resize();
    this.nextDayButton.resize();
  }

  nextDay(): void {
    this.moonData.nextDay();
    this.updateData();
  }

  prevDay(): void {
    this.moonData.prevDay();
    this.updateData();
  }
}
