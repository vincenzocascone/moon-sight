import DateText from "./DateText";
import Environment from "./Environment";
import Moon from "./Moon";
import NextDayButton from "./NextDayButton";
import PhaseManager from "./PhaseManager";
import PhaseText from "./PhaseText";
import PrevDayButton from "./PrevDayButton";
import Stars from "./Stars";
import Experience from "../Experience";

export default class World {
  private static instance: World;
  public moonData!: PhaseManager;
  public moon!: Moon;
  public phaseText!: PhaseText;
  public dateText!: DateText;
  public nextDayButton!: NextDayButton;
  public prevDayButton!: PrevDayButton;
  public stars!: Stars;
  public environment!: Environment;

  private constructor() {
    if (World.instance) {
      return World.instance;
    }
    World.instance = this;

    const { resourcesManager } = Experience.getInstance();

    this.moonData = new PhaseManager();

    resourcesManager.on("ready", () => {
      this.moon = new Moon();
      this.phaseText = new PhaseText();
      this.dateText = new DateText();
      this.nextDayButton = new NextDayButton();
      this.prevDayButton = new PrevDayButton();
      this.stars = new Stars();
      this.environment = new Environment();

      this.moonData.on("newDate", () => {
        this.updateData();
      });
      this.prevDayButton.on("prevDay", () => {
        this.prevDay();
      });
      this.nextDayButton.on("nextDay", () => {
        this.nextDay();
      });
    });
  }

  public static getInstance(): World {
    if (!World.instance) {
      World.instance = new World();
    }
    return World.instance;
  }

  public resize(): void {
    this.phaseText?.resize();
    this.dateText?.resize();
    this.moon?.resize();
    this.prevDayButton?.resize();
    this.nextDayButton?.resize();
  }

  private updateData(): void {
    this.phaseText?.updateData();
    this.environment?.updateData();
    this.dateText?.updateData();
  }

  private nextDay(): void {
    this.moonData?.nextDay();
    this.updateData();
  }

  private prevDay(): void {
    this.moonData?.prevDay();
    this.updateData();
  }
}
