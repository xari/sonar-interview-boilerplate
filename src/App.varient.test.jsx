import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll } from "vitest";

import App from "./App";
import server from "./mock-server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("the repo fetcher UI -- SERVER MOCK VARIANT", () => {
  it("render a list of fetched repositories (with clickable links)", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByLabelText("Repository name");

    await user.type(input, "sonar");

    // Wait for the request to be made before checking the document for the newly rendered content
    await waitFor(() => {
      const repoLink = screen.getByRole("link", {
        textContent: "SonarSource/sonarqube",
      });

      expect(repoLink).toBeInTheDocument();

      expect(repoLink).toHaveAttribute(
        "href",
        "https://github.com/SonarSource/sonarqube"
      );

      expect(repoLink).toHaveAttribute("target", "_blank");
    });
  });
});
