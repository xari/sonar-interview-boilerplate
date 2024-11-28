import React from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from './App'
import Fetch from "./Fetch.jsx";

import mockData from "./mock-data.json";

const server = setupServer(
  http.get("https://api.github.com/search/repositories", () => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (query === "sonar") {
      return HttpResponse.json(mockData);
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays greeting", async () => {
  render(<App />);

  const input = screen.getByLabelText('Repository name')

  fireEvent.change(input, () => 'Sonar');

  await screen.findByRole("heading");

  expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  expect(screen.getByRole("button")).toBeDisabled();
});

test("handles server error", async () => {
  server.use(
    http.get("/greeting", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<Fetch url="/greeting" />);

  fireEvent.click(screen.getByText("Load Greeting"));

  await screen.findByRole("alert");

  expect(screen.getByRole("alert")).toHaveTextContent("Oops, failed to fetch!");
  expect(screen.getByRole("button")).not.toBeDisabled();
});
