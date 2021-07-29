const withMDX = require("@next/mdx")({
  extension: /\.mdx$/,
  options: {},
});

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "mdx"],
});
