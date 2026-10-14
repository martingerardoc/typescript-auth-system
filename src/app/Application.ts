
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { AuthenticationService } from "../services/AuthenticationService.js";

export class Application {
  private readonly rl = createInterface({
    input: stdin,
    output: stdout,
  });

  constructor(
    private readonly authService: AuthenticationService
  ) {}

  async start(): Promise<void> {
    console.log("\n==================================");
    console.log("   TypeScript Authentication System");
    console.log("==================================");

    try {
      await this.showMainMenu();
    } finally {
      this.rl.close();
      console.log("\nApplication closed. Goodbye!");
    }
  }

  private async ask(question: string): Promise<string> {
    return this.rl.question(question);
  }

  private async showMainMenu(): Promise<void> {
    console.log("\n========== MAIN MENU ==========");
    console.log("1. Register");
    console.log("2. Login");
    console.log("3. View Profile");
    console.log("4. Logout");
    console.log("5. Exit");

    const choice = (await this.ask("Choose an option: ")).trim();

    try {
      switch (choice) {
        case "1":
          await this.register();
          break;

        case "2":
          await this.login();
          break;

        case "3":
          this.viewProfile();
          break;

        case "4":
          this.logout();
          break;

        case "5":
          console.log("Thank you for using the application!");
          return;

        default:
          console.log("Invalid option. Please choose 1-5.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
      } else {
        console.log("An unexpected error occurred.");
      }
    }

    // Recursive call: display the main menu again.
    await this.showMainMenu();
  }

  private async register(): Promise<void> {
    console.log("\n========== REGISTRATION ==========");

    const username = await this.ask("Username: ");
    const password = await this.ask("Password (minimum 8 characters): ");
    const fullName = await this.ask("Full name: ");
    const email = await this.ask("Email: ");

    const user = await this.authService.register(
      username,
      password,
      fullName,
      email
    );

    console.log(`\nRegistration successful! Welcome, ${user.username}.`);
    console.log("You can now log in using your credentials.");
  }

  private async login(): Promise<void> {
    console.log("\n========== LOGIN ==========");

    const username = await this.ask("Username: ");
    const password = await this.ask("Password: ");

    const user = await this.authService.login(username, password);

    console.log(`\nLogin successful! Welcome back, ${user.username}.`);
  }

  private viewProfile(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      throw new Error("You must log in before viewing your profile.");
    }

    const profile = user.getProfile();

    console.log("\n========== YOUR PROFILE ==========");
    console.log(`User ID: ${user.id}`);
    console.log(`Username: ${user.username}`);
    console.log(`Full name: ${profile.fullName}`);
    console.log(`Email: ${profile.email}`);
  }

  private logout(): void {
    if (!this.authService.getCurrentUser()) {
      throw new Error("You are not currently logged in.");
    }

    this.authService.logout();
    console.log("\nYou have logged out successfully.");
  }
}
