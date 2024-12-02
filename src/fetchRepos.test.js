import server from "./mock-server";
import { fetchRepos, formatResponse } from "./fetchRepos";

import * as mockData from "./mock-data.json" assert { type: "json" };
import * as formattedMockData from "./formatted-mock-data.json" assert { type: "json" };

// A unit test of the formatter function
describe("formatResponse", () => {
  it("formats the response from the GitHub API into something that we use in our UI", () => {
    const formattedRepos = formatResponse(mockData, "sonar", 1);

    // 1222504 === id for SonarQube
    expect(formattedRepos.items.find(({ id }) => id === 1222504)).toEqual(
      formattedMockData.items.find(({ id }) => id === 1222504)
    );
  });
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// A request-mocking test to mimic fetching from the GitHub API
describe("fetchRepos", () => {
  it("returns a JSON object that contains several GitHub repositories", async () => {
    const sonarRepos = await fetchRepos("sonar");

    const sonarQube = sonarRepos.items.find(({ id }) => id === 1222504);

    expect(JSON.stringify(sonarQube)).toMatch(
      JSON.stringify({
        id: 1222504,
        full_name: "SonarSource/sonarqube",
        avatar_url: "https://avatars.githubusercontent.com/u/545988?v=4",
        owner: "SonarSource",
        html_url: "https://github.com/SonarSource/sonarqube",
        description: "Continuous Inspection",
        stargazers_count: 9137,
      })
    );
  });
});
