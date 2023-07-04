const path = require("path")
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
	publicPath: process.env.NODE_ENV === "development" ? "" : "view/timeline",
	outputDir: "../view/timeline",
	indexPath: "../timeline.html",
	chainWebpack: config => {
		config.output.chunkFilename(`js/[name].[id].[chunkhash:8].js`)
		config.plugin("html").tap(args => {
			args[0].title = "Suivi de projets"
			return args
		})
	},
	configureWebpack: {
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "src"),
				"@Modules": path.resolve(__dirname, "../node_modules"),
				"@Common": path.resolve(__dirname, "../common"),
				"@CommonComponents": path.resolve(__dirname, "../common/components"),
				"@CommonAssets": path.resolve(__dirname, "../common/assets"),
				"@Constants": path.resolve(__dirname, "../common/constants.js"),
				"@Hooks": path.resolve(__dirname, "../common/hooks.js"),
				"@Store": path.resolve(__dirname, "../common/store/index.js"),
				"@Utils": path.resolve(__dirname, "../common/utils.js"),
				"@Components": path.resolve(__dirname, "src/components"),
				"@Assets": path.resolve(__dirname, "src/assets")
			}
		}
	}
}
