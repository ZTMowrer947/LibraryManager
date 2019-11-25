// Imports
import crypto from "crypto";
import path from "path";
import Koa, { ParameterizedContext } from "koa";
import bodyParser from "koa-bodyparser";
import koaCsrf from "koa-csrf";
import helmet from "koa-helmet";
import mount from "koa-mount";
import session from "koa-session";
import serve from "koa-static";
import views from "koa-views";
import { Container } from "typedi";
import env, { EnvType } from "./env";
import errorHandler from "./middleware/errorHandler";
import Assets from "./models/Assets";
import BaseState from "./models/BaseState";
import router from "./routes";
import BookService from "./services/Book.service";

// Paths
const basePath = path.resolve(__dirname, "..", "..");
const viewsPath = path.resolve(basePath, "views");

// App setup
const app = new Koa();

(async () => {
    // Silence output during testing
    app.silent = env === EnvType.Testing;

    // Signing key setup
    const secret1 =
        process.env.SECRET1 ?? crypto.randomBytes(20).toString("hex");
    const secret2 =
        process.env.SECRET2 ?? crypto.randomBytes(20).toString("hex");

    const key = crypto
        .createHmac("sha384", secret2)
        .update(secret1)
        .digest("hex");

    app.keys = [key];

    // Middleware
    app.use(errorHandler);

    app.use(
        views(viewsPath, {
            extension: "pug",
        })
    );

    app.use(bodyParser());

    app.use(
        helmet({
            hsts: false,
            contentSecurityPolicy:
                env === EnvType.Production
                    ? {
                          directives: {
                              defaultSrc: ["'self'", "https:"],
                              objectSrc: ["'none'"],
                              requireSriFor: ["script", "style"],
                          },
                      }
                    : false,
            referrerPolicy: {
                policy: "same-origin",
            },
        })
    );

    app.use(
        session(
            {
                key: "session",
                maxAge: "session",
            },
            app
        )
    );

    app.use(new koaCsrf());

    // Asset setup

    // If we are in development mode,
    if (env === EnvType.Development) {
        // Import webpack packages
        const { default: koaWebpack } = await import("koa-webpack");
        const { default: webpack } = await import("webpack");
        const { default: webpackConfig } = await import("../../webpack.config");

        // Webpack compiler setup
        const compiler = webpack(webpackConfig);

        // Setup middleware
        const middleware = await koaWebpack({ compiler });

        // Apply middleware
        app.use(middleware);

        // Load asset data
        app.use(async (ctx, next) => {
            // Create promise for reading file from memory filesystem
            const readFileAsync = (path: string): Promise<Buffer> =>
                new Promise((resolve, reject) => {
                    middleware.devMiddleware.fileSystem.readFile(
                        path,
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                });

            // Read asset file
            const assetBytes = await readFileAsync(
                path.resolve(basePath, "dist", "assets.json")
            );

            // Parse data as JSON string
            const assets = JSON.parse(assetBytes.toString());

            // Attach asset data to state
            ctx.state.assets = assets;

            // Continue middleware chain
            await next();
        });
    } else {
        // Otherwise, import fs module
        const { default: fs } = await import("fs");

        // Serve public assets
        app.use(
            mount("/public", serve(path.resolve(basePath, "dist", "client")))
        );

        // Load asset data
        app.use(async (ctx, next) => {
            // Create promise for reading file
            const readFileAsync = (path: string): Promise<Buffer> =>
                new Promise((resolve, reject) => {
                    fs.readFile(path, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                });

            // Read asset data
            const assetBytes = await readFileAsync(
                path.resolve(basePath, "dist", "assets.json")
            );

            // Parse data as JSON string
            const assets = JSON.parse(assetBytes.toString());

            // Attach asset data to state
            ctx.state.assets = assets;

            // Continue middleware chain
            await next();
        });
    }

    // Retrieve links from asset data
    app.use(async (ctx, next) => {
        // Retrieve assets from state
        const assets: Assets = ctx.state.assets;

        // Reorganize assets
        let chunks = Object.keys(assets);
        chunks = [...chunks.slice(1), chunks[0]];

        const finalAssets = chunks.map(chunk => assets[chunk]);

        // Retrieve paths for each asset type
        const scripts = finalAssets.reduce((acc: string[], asset) => {
            if (!!asset.js) {
                return [...acc, asset.js];
            }

            return acc;
        }, []);

        const styles = finalAssets.reduce((acc: string[], asset) => {
            if (!!asset.css) {
                return [...acc, asset.css];
            }

            return acc;
        }, []);

        const scriptHashes = finalAssets.reduce((acc: string[], asset) => {
            if (!!asset.jsIntegrity) {
                return [...acc, asset.jsIntegrity];
            }

            return acc;
        }, []);

        const styleHashes = finalAssets.reduce((acc: string[], asset) => {
            if (!!asset.cssIntegrity) {
                return [...acc, asset.cssIntegrity];
            }

            return acc;
        }, []);

        // Attach assets to state
        ctx.state = {
            scripts,
            styles,
            scriptHashes,
            styleHashes,
        };

        // Continue middleware chain
        await next();
    });

    // Attach Book service to state
    app.use(async (ctx: ParameterizedContext<BaseState>, next) => {
        // Attach BookService from TypeDI container
        ctx.state.bookService = Container.get(BookService);

        // Continue middleware chain
        await next();
    });

    // Routes
    app.use(router.routes());
    app.use(router.allowedMethods());
})();

// Export
export default app;
