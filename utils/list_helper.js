const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likes = blogs.map((blog) => blog.likes);
  const maxLikes = Math.max(...likes);

  return blogs.find((blog) => blog.likes === maxLikes);
};
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  const mostBlogsAuthor = Object.keys(authorCount).reduce((a, b) =>
    authorCount[a] > authorCount[b] ? a : b,
  );

  return mostBlogsAuthor
    ? { author: mostBlogsAuthor, blogs: authorCount[mostBlogsAuthor] }
    : null;
};
const mostlikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const mostLikedAuthor = Object.keys(authorLikes).reduce((a, b) =>
    authorLikes[a] > authorLikes[b] ? a : b,
  );

  return mostLikedAuthor
    ? { author: mostLikedAuthor, likes: authorLikes[mostLikedAuthor] }
    : null;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostlikes,
};
