
import { Application } from "./app/Application.js";
import { AuthenticationService } from "./services/AuthenticationService.js";

const authService = new AuthenticationService();
const app = new Application(authService);

app.start().catch((error: unknown) => {
  console.error("Failed to start the application:", error);
  process.exitCode = 1;
});

