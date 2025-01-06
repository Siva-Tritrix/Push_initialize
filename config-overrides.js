const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    buffer: require.resolve("buffer"),
    util: require.resolve("util"),
    stream: require.resolve("stream-browserify"),
    process: require.resolve("process"),
    url: require.resolve("url/"), // Polyfill for 'url'
    zlib: require.resolve("browserify-zlib"), // Polyfill for 'zlib'
    assert: require.resolve("assert/"), // Polyfill for 'assert'
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  // Suppress source map warnings (optional)
  config.module.rules.push({
    test: /\.js$/,
    enforce: "pre",
    use: ["source-map-loader"],
  });

  return config;
};
