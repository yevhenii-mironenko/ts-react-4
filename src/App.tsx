import { useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";

function App() {
  const [fetchedData, setFetchedData] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = (await get(
        "https://jsonplaceholder.typicode.com/posts/",
      )) as RawDataBlogPost[];

      const blogPosts: BlogPost[] = data.map((post) => ({
        id: post.id,
        title: post.title,
        text: post.body,
      }));

      setFetchedData(blogPosts);
    }

    fetchData();
  }, []);

  return (
    <main>
      <img src="/data-fetching.png" alt="Data Fetching" />
      <BlogPosts posts={fetchedData} />
    </main>
  );
}

export default App;

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};
