import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import { wrapSandboxEsbuild } from "../../sandbox/index.js";

const prod = process.argv[2] === "production";

const context = await esbuild.context({
    entryPoints: ["src/main.ts"],
    bundle: true,
    external: ["obsidian", "electron", ...builtins],
    format: "cjs",
    target: "es6",
    logLevel: "info",
    sourcemap: "inline",
    sourcesContent: !prod,
    treeShaking: true,
    plugins: [wrapSandboxEsbuild()],
    write: false,
    outfile: "build/main.js",
});

if (prod) {
    context.rebuild().catch(() => process.exit(1));
    context.dispose();
} else {
    context.watch().catch(() => process.exit(1));
}
