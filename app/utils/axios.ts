import axios from "axios";

export const getPostData = async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post data:", error);
    return [];
  }
};
