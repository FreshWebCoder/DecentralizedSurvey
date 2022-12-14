const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const lessToJs = require("less-vars-to-js");
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, "./src/less/theme.less"), "utf8"));

const tsImportPluginFactory = require("ts-import-plugin");
const tsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

// lessToJs does not support @icon-url: "some-string"
// so we are manually adding it to the produced themeVariables js object here
themeVariables["@icon-url"] = "http://localhost:8082/fonts/iconfont";

module.exports = (env, argv) => {
  return {
    context: path.join(__dirname, "src"),
    entry: "./index.tsx",
    output: {
      filename: "decentralizedsurvey.js",
      path: path.join(__dirname, "public/"),
      publicPath: "/"
    },

    // Enable sourcemaps for debugging webpack"s output.
    devtool: "source-map",

    devServer: {
      contentBase: "./public",
      disableHostCheck: true,
      historyApiFallback: true,
      host: "0.0.0.0",
      inline: true,
      port: 3000,
      stats: {
        warnings: false
      }
    },

    module: {
      rules: [
        {
          test: /\.(jsx|tsx|js|ts)$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [tsImportPluginFactory({
                libraryName: "antd",
                libraryDirectory: "lib",
                style: true
              }
              )]
            }),
            compilerOptions: {
              module: "es2015"
            }
          },
          exclude: /node_modules/
        },

        // All output `.js` files will have any sourcemaps re-processed by "source-map-loader"
        {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader"
        },

        {
          enforce: "pre",
          test: /\.tsx?$/,
          loader: "tslint-loader",
          exclude: /node_modules/,
          options: {
            failOnHint: true,
            configuration: require("./tslint.json")
          }
        },

        {
          test: /\.less$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true,
                modifyVars: [themeVariables],
                root: path.resolve(__dirname, "./")
              }
            }
          ]
        },

        {
          test: /\.sol/,
          use: [
            {
              loader: "json-loader"
            },
            {
              loader: "truffle-solidity-loader",
              options: {
                network: argv.mode === "production" ? "ropsten" : "development",
              }
            }
          ]
        },

        {
          test: /\.(pdf|gif|ico|png|jp(e*)g|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8000, // Convert images < 8kb to base64 strings
                name: "images/[hash]-[name].[ext]"
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"' + argv.mode + '"'
        }
      })
    ],

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      plugins: [
        new tsConfigPathsPlugin()
      ]
    },

    stats: {
      warnings: false
    }
  };
};
