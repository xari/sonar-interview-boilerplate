import { useCallback, useEffect, useState } from "react";
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
    <div>
      <img alt={`User img for ${owner}'s profile`} src={avatar_url} />
      <a href={html_url}>{full_name}</a>
      <span>{description}</span>
      <span>{stargazers_count} Stars</span>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState({});

  const handleChange = async (e) => {
    const searchQuery = e.target.value;

    if (searchQuery === "") {
      setRepos({}); // User has cleared the input field
    } else {
      setLoading(true);

      fetchRepos(searchQuery)
        .then((repos) => setRepos(repos))
        .then(() => setLoading(false));
    }
  };

  const debounceHandleChange = _.debounce(handleChange, 1000);

  const handleClick = async () => {
    const { q, total_count, items: prevItems, page: prevPage } = repos;

    setLoading(true);

    fetchRepos(q, prevPage + 1)
      .then(({ items: newItems, page: newPage }) => {
        setRepos({
          q,
          total_count,
          items: [...prevItems, ...newItems],
          page: newPage,
        });
      })
      .then(() => setLoading(false));
  };

  const debounceHandleClick = _.debounce(handleClick, 1000);

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
      <input onChange={debounceHandleChange} />
      <div className="grid">
        {repos.items &&
          repos.items.map((repo) => <Card key={repo.id} {...repo} />)}
      </div>
      <div className="help-text">
        {loading
          ? "Loading..."
          : repos.items && repos.items.length === 0
          ? "Nothing found."
          : null}
      </div>
      {pagination && (
        <div className="more-wrapper">
          <div>{pagination}</div>
          <button onClick={debounceHandleClick}>Load more</button>
        </div>
      )}
    </div>
  );
}

export default App;
