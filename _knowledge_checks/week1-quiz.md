# Week 1 Quiz — Project Setup, Tooling & TypeScript Fundamentals

Use this quiz to test your understanding of the concepts covered in Week 1.
Try answering each question **before** looking at the answers at the bottom.

---

## Section 1: Project Setup & Git

**Q1.** What is the purpose of a `.gitignore` file, and name three things you'd typically include in one for a Node.js/TypeScript project. - The .gitignore file lists folders and file types that are to be ignored during git operations such as add and commit. For a Node.js/Typescript project I would include the node_modules folder, the .env file, and the dist folder.

**Q2.** What is the purpose of a `.env.example` file? Why not just commit `.env` directly? The .env.example lets future user know the environment variables that will be needed for the project. You do not include the .env becuase it will expose sensitive data.

**Q3.** True or False: You should commit `node_modules/` to your repository so other developers don't need to run `npm install`. No, this will be a waste of resources. The node_modules folder will be created after the repo is cloned and the user runs the npm install command.

---

## Section 2: TypeScript Configuration

**Q4.** In your `tsconfig.json`, you have `"strict": true`. What does this flag enable? Name at least three of the individual checks it turns on. This turns on strict type checking. It ensures that null or undefined values are not valid for types, it checks the function parameters and makes sure they are correct, it also raises an error when "this" has an any type.

**Q5.** What is the difference between `rootDir` and `outDir` in `tsconfig.json`? Root dir is the dir of your main project files, typically src folder, outDir is the output directory for the compiled code.

**Q6.** Your `tsconfig.json` uses `"module": "commonjs"`. How does this differ from `"module": "ESNext"`? When might you choose one over the other? The main difference is in the syntax that can be compiled. commonjs uses a legacy syntax while ESNext will have support for import statements rather than require statements. Esnext is also used by modern browsers.

**Q7.** What does `"esModuleInterop": true` do, and why is it useful?

**Q8.** What does the `"declaration": true` compiler option produce, and who is it useful for?

**Q9.** Your project targets `"target": "ES2022"`. What does this control? What would happen if you set it to `"ES5"`?

---

## Section 3: ESLint & Prettier

**Q10.** What is the difference between a **linter** (ESLint) and a **formatter** (Prettier)? Why use both?

**Q11.** In your ESLint config, you include `eslint-config-prettier`. What does this do and why is it necessary?

**Q12.** Your ESLint config has `'no-console': 'warn'`. What are the three severity levels in ESLint and what does each do?

**Q13.** What is the "flat config" format for ESLint (which you're using in `eslint.config.js`)? How does it differ from the legacy `.eslintrc` format?

---

## Section 4: Utility Functions — Code Reading

**Q14.** Given this function:

```ts
export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
```

- What does `formatMoney(750)` return?
- Why accept **cents** instead of dollars as the parameter?

**Q15.** Given this function:

```ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}
```

- Walk through each step for the input `"  Hello, World!  "`.
- What does the regex `/[^\w\s-]/g` match?

**Q16.** Given this function:

```ts
import { randomBytes } from 'crypto';

export function generateId(length: number = 16): string {
  return randomBytes(length).toString('hex');
}
```

- Why does `generateId()` return a string of length 32, not 16?
- What does the `= 16` in the parameter mean?
- Why use `crypto.randomBytes` instead of `Math.random()`?

---

## Section 5: Testing with Jest

**Q17.** What is the purpose of `describe()` and `it()` (or `test()`) in Jest? How do they differ?

**Q18.** What Jest matcher would you use to:

- a) Check if a string matches a regex pattern?
- b) Check the length of a string or array?
- c) Check that two values are **not** equal?

**Q19.** In your `generateId` test, you wrote:

```ts
it('generates unique values', () => {
  const a = generateId();
  const b = generateId();
  expect(a).not.toBe(b);
});
```

Is this test **deterministic**? Could it ever fail with correct code? Why or why not?

**Q20.** What is `ts-jest` and why do you need it? What would happen if you tried to run Jest on `.ts` files without it?

**Q21.** Your `jest.config.js` sets `testEnvironment: "node"`. What is the alternative, and when would you use it?

---

## Section 6: Pre-commit Hooks & CI

**Q22.** What is **Husky** and what problem does it solve?

**Q23.** What is **lint-staged** and how does it work with Husky? Looking at your `package.json`, what happens when you commit a `.ts` file?

**Q24.** What is the purpose of a CI pipeline (like the `ci.yml` skeleton from Step 13)? Name at least two things it should run for this project.

---

## Section 7: Interview-Style Conceptual Questions

**Q25.** Explain the difference between `dependencies` and `devDependencies` in `package.json`. Your project only has `devDependencies` — why?

**Q26.** What is the PERN stack? Name each letter and what it represents.

**Q27.** If an interviewer asked: _"Why TypeScript over JavaScript?"_ — give a concise answer citing at least three benefits.

**Q28.** What does `"type": "commonjs"` in `package.json` mean? How does it affect how Node.js treats `.js` files?

**Q29.** Explain what a **source map** is (`"sourceMap": true` in your tsconfig) and when it's useful.

**Q30.** You store money as **cents (integers)** rather than dollars (floats). Explain why this is a best practice. What could go wrong with `0.1 + 0.2` in JavaScript?

---

## Bonus: Write the Code

**B1.** Write a utility function `capitalize(text: string): string` that capitalizes the first letter of each word. Include the type annotations.

**B2.** Write a Jest test suite for the function above with at least 3 test cases.

**B3.** Looking at your `slugify` function, what would happen with the input `"---"` ? Trace through each step.

---

---

# Answer Key

<details>
<summary>Click to reveal answers</summary>

### A1

`.gitignore` tells Git which files/folders to exclude from version control. Common entries for Node/TS projects: `node_modules/`, `dist/`, `.env`, `.DS_Store`, `coverage/`.

### A2

`.env.example` documents the required environment variables without containing real secrets. `.env` should never be committed because it contains sensitive values like API keys and database credentials.

### A3

**False.** `node_modules/` should be in `.gitignore`. It's large, platform-specific, and can be recreated by running `npm install` from `package.json`.

### A4

`"strict": true` enables all strict type-checking options including:

- `strictNullChecks` — `null`/`undefined` not assignable to other types
- `noImplicitAny` — error on expressions with implied `any` type
- `strictFunctionTypes` — stricter function parameter checking
- `strictBindCallApply` — strict `bind`, `call`, `apply` checking
- `strictPropertyInitialization` — class properties must be initialized
- `noImplicitThis` — error on `this` with implied `any` type
- `alwaysStrict` — emit `"use strict"` in every file

### A5

`rootDir` specifies the root folder of source files (`src`). `outDir` specifies where compiled JavaScript output goes (`dist`). Together they preserve the folder structure from `rootDir` inside `outDir`.

### A6

`"commonjs"` emits `require()`/`module.exports` (Node.js traditional format). `"ESNext"` emits `import`/`export` (ES modules). CommonJS is standard for Node.js projects; ESNext is used for modern frontend builds or Node.js with `"type": "module"`.

### A7

`esModuleInterop` adds helper code so you can use `import x from 'module'` syntax with CommonJS modules that use `module.exports`. Without it, you'd need `import * as x from 'module'` for CJS modules.

### A8

`"declaration": true` generates `.d.ts` type declaration files alongside compiled JS. These are useful for library consumers — they provide type information without requiring the original TypeScript source.

### A9

`target` controls which JS version the compiler emits. `ES2022` allows modern syntax (top-level await, class fields, etc.). `ES5` would transpile all modern syntax down to older JS for legacy browser compatibility, resulting in larger output.

### A10

A **linter** analyzes code for logical errors, bugs, and code quality issues (unused variables, type mismatches). A **formatter** handles code style (indentation, line length, quotes). Using both ensures code is both correct and consistently styled.

### A11

`eslint-config-prettier` turns off all ESLint rules that would conflict with Prettier's formatting. Without it, ESLint and Prettier would fight over style issues like semicolons and quotes.

### A12

- `"off"` (or `0`) — rule is disabled
- `"warn"` (or `1`) — rule violations show as warnings but don't fail the build
- `"error"` (or `2`) — rule violations cause ESLint to exit with a non-zero code (fails CI)

### A13

The flat config (`eslint.config.js`) exports an **array** of config objects. Each object applies to specific file patterns. The legacy `.eslintrc` format used cascading/extending configs with `extends`, `overrides`, etc. Flat config is simpler and more explicit.

### A14

- `formatMoney(750)` returns `"$7.50"`
- Cents avoids floating-point precision issues. `$7.50` stored as integer `750` is exact; as a float `7.50` can introduce rounding errors in calculations.

### A15

Step-by-step for `"  Hello, World!  "`:

1. `.toLowerCase()` → `"  hello, world!  "`
2. `.trim()` → `"hello, world!"`
3. `.replace(/[^\w\s-]/g, '')` → `"hello world"` (removes `,` and `!`)
4. `.replace(/[\s_]+/g, '-')` → `"hello-world"`
5. `.replace(/-+/g, '-')` → `"hello-world"` (no change needed)

The regex `/[^\w\s-]/g` matches any character that is **not** a word character (`\w` = `[a-zA-Z0-9_]`), **not** whitespace (`\s`), and **not** a hyphen. Essentially it strips punctuation and special characters.

### A16

- Each byte becomes **two** hex characters (e.g., byte `255` → `"ff"`), so 16 bytes = 32 hex characters.
- `= 16` is a **default parameter** — if no argument is passed, `length` defaults to `16`.
- `crypto.randomBytes` is **cryptographically secure** (uses the OS's CSPRNG). `Math.random()` is not cryptographically secure and is predictable — unsuitable for IDs that must be unguessable.

### A17

`describe()` groups related tests into a labeled block (a "test suite"). `it()` / `test()` defines an individual test case. `describe` is for organization; `it` contains the actual assertions.

### A18

- a) `expect(str).toMatch(/pattern/)`
- b) `expect(str).toHaveLength(n)`
- c) `expect(a).not.toBe(b)`

### A19

Technically it is **not 100% deterministic** — there is an astronomically small probability that two calls to `randomBytes` could produce the same output. In practice, for 16 bytes (2^128 possibilities), a collision is so unlikely it will never happen. The test is effectively reliable.

### A20

`ts-jest` is a Jest transformer that compiles TypeScript files on the fly so Jest can execute them. Without it, Jest would fail because it cannot parse TypeScript syntax natively.

### A21

The alternative is `"jsdom"`, which simulates a browser DOM environment. Use `"jsdom"` when testing frontend/React components that interact with `document`, `window`, etc. Use `"node"` for backend/utility code.

### A22

Husky manages **Git hooks** — scripts that run automatically at certain Git events (pre-commit, pre-push, etc.). It ensures that checks like linting and tests run before code is committed, preventing broken code from entering the repository.

### A23

lint-staged runs commands **only on staged files** (not the entire codebase), making pre-commit hooks fast. From your config, when you commit a `.ts` or `.tsx` file, it runs `eslint --fix` then `prettier --write` on just those staged files.

### A24

CI (Continuous Integration) automatically runs checks on every push/PR to catch issues early. For this project it should run: `npm run lint` (code quality), `npm test` (unit tests), and optionally `npm run build` (type checking / compilation).

### A25

`dependencies` are needed at **runtime** (e.g., Express, React). `devDependencies` are only needed during **development** (testing, linting, building). This project only has devDependencies because it's currently just utility functions with tooling — no runtime dependencies yet.

### A26

**P**ostgreSQL (database), **E**xpress (backend framework), **R**eact (frontend library), **N**ode.js (runtime). Together they form a full-stack JavaScript/TypeScript application.

### A27

TypeScript provides: (1) **static type checking** — catches bugs at compile time before they reach production, (2) **better IDE support** — autocompletion, refactoring, and inline documentation, (3) **self-documenting code** — types serve as documentation for function signatures and data shapes, (4) **safer refactoring** — the compiler catches breaking changes across the codebase.

### A28

`"type": "commonjs"` tells Node.js to treat `.js` files as CommonJS modules (using `require`/`module.exports`). If set to `"module"`, Node.js would treat `.js` files as ES modules (using `import`/`export`).

### A29

A source map is a file that maps compiled/minified code back to the original source. When debugging compiled JS, the debugger can show you the original TypeScript line where an error occurred, rather than the generated JavaScript.

### A30

Floating-point arithmetic is imprecise in JavaScript: `0.1 + 0.2 === 0.30000000000000004`. By storing money as integer cents, all arithmetic is exact. `10 + 20 === 30` — no rounding errors. This is an industry-standard practice for financial calculations.

### B1

```ts
export function capitalize(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
```

### B2

```ts
import { capitalize } from '../capitalize';

describe('capitalize', () => {
  it('capitalizes a single word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('capitalizes multiple words', () => {
    expect(capitalize('hello world')).toBe('Hello World');
  });

  it('handles already capitalized text', () => {
    expect(capitalize('HELLO WORLD')).toBe('Hello World');
  });
});
```

### B3

Input `"---"`:

1. `.toLowerCase()` → `"---"`
2. `.trim()` → `"---"`
3. `.replace(/[^\w\s-]/g, '')` → `"---"` (hyphens are allowed)
4. `.replace(/[\s_]+/g, '-')` → `"---"` (no spaces or underscores)
5. `.replace(/-+/g, '-')` → `"-"` (collapses to single hyphen)

Result: `"-"`

</details>
