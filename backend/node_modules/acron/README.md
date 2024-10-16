# acron

Generate acronyms based on the 10,000 most common English words.

## CLI Usage

```
npm i -g acron
acron lgtm
```

Result:

```
Lions Gobble Tiny Mouse
```

## Module Usage

```js
const acron = require("acron");
acron("lgtm");
```

Result:

```js
[ 'lions', 'gobble', 'tiny', 'mouse' ]
```
