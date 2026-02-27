import { useEffect, useState } from "react";
import { get } from "./util/http";
import { z } from "zod";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [fetchedData, setFetchedData] = useState<BlogPost[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);

      try {
        const data = await get(
          "https://jsonplaceholder.typicode.com/posts",
          z.array(rawDataBlogPostSchema),
        );
        const parsedData = expectedResponseDataSchema.parse(data);
        const blogPosts: BlogPost[] = parsedData.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });
        setFetchedData(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsFetching(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <main>
      <img src="/data-fetching.png" alt="Data Fetching" />
      {isFetching && <p id="loading-fallback">Fetching posts...</p>}
      {error && <ErrorMessage text={error}></ErrorMessage>}
      {fetchedData.length > 0 && <BlogPosts posts={fetchedData} />}
    </main>
  );
}

export default App;

const rawDataBlogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

const expectedResponseDataSchema = z.array(rawDataBlogPostSchema);
