const doctrine = require('doctrine');

const COMMENTS_PATTERN =
  /((\/\*\*+[\s\S]*?\*\/)|(\/\*+.*\*\/)|^\/\/.*?[\r\n])[\r\n]*/gm;
const BREAK_LINE = /\n/g;

const getComments = async (text) => {
  const comments = text.match(COMMENTS_PATTERN);
  if (comments) {
    const filterComments = comments.filter((comment) =>
      comment.match(BREAK_LINE)
    );
    return filterComments.map((comment) => comment.trim());
  }
  return [];
};

const jsdocInfo =
  (options = { unwrap: true }) =>
  (comments) => {
    if (!comments || !Array.isArray(comments)) return [];
    const parsed = comments.map((comment) => {
      const parsedValue = doctrine.parse(comment, options);
      const tags = parsedValue.tags.map((tag) => ({
        ...tag,
        description: tag.description
          ? tag.description.replace('\n/', '').replace(/\/$/, '')
          : tag.description,
      }));
      const description = parsedValue.description
        .replace('/**\n', '')
        .replace('\n/', '');
      return {
        ...parsedValue,
        tags,
        description,
      };
    });
    return parsed;
  };

module.exports = {
  getComments,
  jsdocInfo,
};
