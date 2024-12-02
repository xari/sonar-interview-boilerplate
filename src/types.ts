type RawRepo = {
  id: number;
  full_name: string;
  owner: {avatar_url: string, login: string};
  html_url: string;
  description: string;
  stargazers_count: number;
}

export type ServerResponse = {
  q: string;
  total_count: number;
  items: Array<RawRepo>;
};

type Repo = {
  id: number;
  full_name: string;
  avatar_url: string;
  owner: string;
  html_url: string;
  description: string;
  stargazers_count: number;
};

export type ReposState = {
  q: string;
  total_count: number;
  items: Array<Repo>;
  page: number;
};

