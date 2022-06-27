import { useEffect, useState, useReducer } from "react";
import _ from "lodash";
import "./App.css";

const truncate = (input, n = 80) =>
  input.length > n ? `${input.substring(0, n)}...` : input;

function fetchRepos(q, page = 1) {
  return fetch(
    `https://api.github.com/search/repositories?q=${q}&per_page=5&page=${page}`
  )
    .then((response) => response.json())
    .then((newRepos) => {
      const repoItems = newRepos.items.map((item) => {
        return {
          id: item.id,
          full_name: item.full_name,
          avatar_url: item.owner.avatar_url,
          owner: item.owner.login,
          html_url: item.html_url,
          description: item.description && truncate(item.description),
          stargazers_count: item.stargazers_count,
        };
      });

      return {
        q,
        total_count: newRepos.total_count,
        items: repoItems,
        page,
      };
    });
}

function Card({
  owner,
  avatar_url,
  html_url,
  full_name,
  description,
  stargazers_count,
}) {
  return (
    <div className="card-wrapper">
      <img alt={`User img for ${owner}'s profile`} src={avatar_url} />
      <div>
        <a href={html_url} target="_blank" rel="noreferrer">
          <h2 tabIndex="0">{full_name}</h2>
        </a>
        <p>{description}</p>
        <span>⭐ {stargazers_count}</span>
      </div>
    </div>
  );
}

function reduceRepos(state, { type, ...repos }) {
  switch (type) {
    case "clear":
      return {};
    case "fill":
      return repos;
    case "increment":
      return {
        ...state,
        items: [...state.items, ...repos.items],
        page: state.page + 1,
      };
    default:
      throw new Error();
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [repos, dispatchRepos] = useReducer(reduceRepos, {});

  const handleChange = async (e) => {
    const searchQuery = e.target.value;

    if (searchQuery === "") {
      dispatchRepos({ type: "clear" }); // User has cleared the input field
    } else {
      setLoading(true);

      fetchRepos(searchQuery)
        .then((repos) => dispatchRepos({ type: "fill", ...repos }))
        .then(() => setLoading(false));
    }
  };

  const debounceHandleChange = _.debounce(handleChange, 800);

  const handleClick = async () => {
    const { q, page } = repos;

    setLoading(true);

    fetchRepos(q, page + 1)
      .then(({ items }) => {
        dispatchRepos({ type: "increment", items });
      })
      .then(() => setLoading(false));
  };

  const debounceHandleClick = _.debounce(handleClick, 500);

  // For monitoring state changes
  useEffect(() => {
    console.log(loading);
    console.log(repos);
  });

  return (
    <div>
      <input
        onChange={debounceHandleChange}
        placeholder="Search for repos here"
      />
      {loading ? (
        <span className="load-text">Loading...</span>
      ) : repos.items && repos.items.length === 0 ? (
        <span className="help-text">No repositories matched that query.</span>
      ) : null}
      <div className="grid">
        {repos.items &&
          repos.items.map((repo, i) => <Card key={i} {...repo} />)}
      </div>
      <div className="more-wrapper">
        {repos.items && repos.items.length < repos.total_count ? (
          <>
            <span>{`${repos.items.length} of ${repos.total_count}`}</span>
            <button onClick={debounceHandleClick}>
              {loading ? "Loading..." : "Load more"}
            </button>
          </>
        ) : repos.items && repos.total_count ? (
          <span>{`All ${repos.items.length} of ${repos.total_count} matching repositories shown.`}</span>
        ) : null}
      </div>
    </div>
  );
}

export default App;
