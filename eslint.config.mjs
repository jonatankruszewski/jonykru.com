import eslintPluginNext from "@next/eslint-plugin-next"
import eslintPluginImport from "eslint-plugin-import"
import eslintPluginReactHooks from "eslint-plugin-react-hooks"
import typescriptEslint from "typescript-eslint"
import * as fs from "fs"

const eslintIgnore = [
    ".git/",
    ".next/",
    "out/",
    // CloudFront Functions run on a restricted JS runtime at the edge, not in
    // the app bundle — the handler is invoked by CloudFront, never imported.
    "infra/",
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    "*.min.js",
    "*.config.js",
    "*.d.ts",
]

const config = typescriptEslint.config(
    {
        ignores: eslintIgnore,
    },
    typescriptEslint.configs.recommended,
    eslintPluginImport.flatConfigs.recommended,
    {
        plugins: {
            "@next/next": eslintPluginNext,
            "react-hooks": eslintPluginReactHooks,
        },
        rules: {
            ...eslintPluginNext.configs.recommended.rules,
            ...eslintPluginNext.configs["core-web-vitals"].rules,
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
    {
        settings: {
            tailwindcss: {
                callees: ["classnames", "clsx", "ctl", "cn", "cva"],
            },
            "import/resolver": {
                typescript: true,
                node: true,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            // dangerouslySetInnerHTML is an XSS footgun. The one sanctioned use
            // (inline, escaped JSON-LD in the layout) opts out per-line with a
            // justification; anything new has to do the same, deliberately.
            "no-restricted-syntax": [
                "error",
                {
                    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
                    message:
                        "Avoid dangerouslySetInnerHTML. If it is genuinely required (e.g. inline JSON-LD), disable this rule on the specific line with a justification.",
                },
            ],
            "sort-imports": [
                "error",
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                },
            ],
            "import/order": [
                "warn",
                {
                    groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
                    pathGroups: [
                        ...getDirectoriesToSort().map((singleDir) => ({
                            pattern: `${singleDir}/**`,
                            group: "internal",
                        })),
                        {
                            pattern: "env",
                            group: "internal",
                        },
                        {
                            pattern: "theme",
                            group: "internal",
                        },
                        {
                            pattern: "public/**",
                            group: "internal",
                            position: "after",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["internal"],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
        },
    }
)

function getDirectoriesToSort() {
    const ignoredSortingDirectories = [".git", ".next", ".vscode", "node_modules"]
    return fs
        .readdirSync(process.cwd())
        .filter((file) => fs.statSync(process.cwd() + "/" + file).isDirectory())
        .filter((f) => !ignoredSortingDirectories.includes(f))
}

export default config
