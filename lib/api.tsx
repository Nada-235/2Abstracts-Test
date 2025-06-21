import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com/repos/octocat/Hello-World/issues?",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
  },
});

type GetDataParams = {
  page: number;
  per_page: number;
  sort: string;
  direction: string;
};

export type Issue = {
  id: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getData(
  params: GetDataParams,
  retries = 3,
  delay = 2000
): Promise<Issue[]> {
  try {
    const { data } = await githubApi.get("/", { params });

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("API returned an empty result.");
      return [];
    }

    console.log(data, "Fetched issues");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
    } else {
      console.error("Error fetching data:", error);
    }

    if (retries > 0) {
      console.log(`Retrying in ${delay / 1000}s... (${retries} attempts left)`);
      await sleep(delay);
      return getData(params, retries - 1, delay * 2);
    }

    throw new Error("All retry attempts failed.");
  }
}
