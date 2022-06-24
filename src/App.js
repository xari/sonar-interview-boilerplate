import { useEffect, useState, useReducer } from "react";
import _ from "lodash";
import "./App.css";

function fetchRepos(q, page = 1) {
  return fetch(
    `https://api.github.com/search/repositories?q=${q}&per_page=5&page=${page}`
  )
    .then((response) => response.json())
    .then((newRepos) => {
      const repoItems = newRepos.items.map((item) => ({
        id: item.id,
        full_name: item.full_name,
        avatar_url: item.owner.avatar_url,
        owner: item.owner.login,
        html_url: item.html_url,
        description: item.description,
        stargazers_count: item.stargazers_count,
      }));

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

  useEffect(() => {
    console.log(loading);
    console.log(repos);
  });

  const pagination =
    repos.page && repos.total_count
      ? `${repos.page * 5} of ${repos.total_count}`
      : null;

  return (
    <div>
      <input
        onChange={debounceHandleChange}
        placeholder="Search GitHub for repos here"
      />
      <div className="grid">
        {repos.items &&
          repos.items.map((repo, i) => <Card key={i} {...repo} />)}
      </div>
      <div className="help-text">
        {loading
          ? "Loading..."
          : repos.items && repos.items.length === 0
          ? "No repositories matched that query."
          : null}
      </div>
      {pagination && (
        <div className="more-wrapper">
          <span>{pagination}</span>
          <button onClick={debounceHandleClick}>Load more</button>
        </div>
      )}
    </div>
  );
}

export default App;
