const truncate = (input, n = 80) =>
  input.length > n ? `${input.substring(0, n)}...` : input;

export function formatResponse(newRepos, q, page) {
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
}

export async function fetchRepos(q, handleCatch = () => {}, page = 1) {
  return fetch(
    `https://api.github.com/search/repositories?q=${q}&per_page=5&page=${page}`
  )
    .then((response) => response.json())
    .then((newRepos) => formatResponse(newRepos, q, page))
    .catch(handleCatch);
}
