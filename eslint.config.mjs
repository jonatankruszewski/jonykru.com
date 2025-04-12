import * as fs from "fs"

import eslintPluginImport from "eslint-plugin-import"
import eslintPluginNext from "@next/eslint-plugin-next"
import typescriptEslint from "typescript-eslint"
import eslintPluginReactHooks from "eslint-plugin-react-hooks"

const eslintIgnore = [
    ".git/",
    ".next/",
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
