import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import * as mockData from "./mock-data.json" assert { type: "json" };

const server = setupServer(
  http.get("https://api.github.com/search/repositories", ({ request }) => {
    const { url } = request;
    const { searchParams } = url;

    // TODO: Remove this later?
    if (searchParams) {
      const q = searchParams.get("q");
      const per_page = searchParams.get("per_page");
      const page = searchParams.get("page");

      console.log("q", q);
      console.log("per_page", per_page);
      console.log("page", page);
    }

    return HttpResponse.json(mockData);
  })
);

export default server;
