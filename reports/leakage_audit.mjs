import { PROFILE_COPY_LIBRARY } from './src/profileCopyLibrary.js';

const targetLocales = ['fr', 'es', 'it', 'pt', 'de'];
const tokens = [
  'workflow', 'feedback', 'review', 'checkpoint', 'roadmap', 'pipeline',
  'playbook', 'brief', 'timing', 'handoff', 'client-facing', 'team alignment',
  'project updates', 'lessons learned', 'commercial viability', 'brand coordination',
  'store meeting', 'coordination on targets', 'product knowledge update', 'shot',
  'edit', 'callback', 'rebooking', 'fit', 'runway', 'set', 'post-production',
  'career', 'leadership', 'performance', 'update'
];

// We need to ignore exact word 'Masterclass', 'EOEX', and 'AI'. But they are not in the tokens list anyway.
// Let's create search boundaries. Since they could be substrings (e.g., "brief", "timing"), 
// we scan for matched phrases case-insensitively.
// The query says "scans all non-English locales recursively for suspicious English leakage tokens/phrases".
// By "recursively", it mea// By "recursively", it mea// By "recursin each locale's copy tree.

function traverseAndFind(obj, locale, occufunction traverseAndFind(obj, locale, occuf
    // Check against each t    // Check against each t    // Check against each t    // Csitive subs    // Check against each t    // Check against each t    // Check ae or case-insensitive search.
    // Let's search case-insensitively using regex or simple match.    // Let's search case-insensitively using regex or simple match.    // ght mean    // Let's search case-insensitively using regex or simple matchnot in our t    // Let's search case-insensitively uing has them, we don't count them as matches/violations (but they won't match our tokens anyway, except if 'AI' is part of some word, or Masterclass, but they don't overlap).
    // Let's do a regex check or a simple substring search. Some words like "fit" or "set" or "shot" might be substrings of longer words. 
    // Usually, we want case-insensitive word-boundary or substring matches. Let's do a case-insensitive word-boundary check first,
    // but also accommodate hyphenated/compound phrases.
    // Let's implement both or a word-boundary match (e.g., \btoken\b) to be safe and precise, or check words.
    // Let's match on word boundary: \btoken\b. But let's check custom boundaries (e.g., allowing hyphens, apostrophes)
    // RegExp with word boundary: new RegExp(`\\b${token}\\b`, 'i');
    
    tokens.forEach(token => {
      // For multi-word phrases or hyphenated, word boundary works fine (e.g. \bclient-facing\b).
      // Let's construct a safe regex:
      // Be careful: 'edit' should not match 'méditer', 'coordination on targets' has spaces.
      // So \\btoken\\b (using boundary) works perfectly.
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.     rences      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.      if (regex.      if (reglocale, occurrences));
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(val => traverseAndFind(val, locale, occurrences));
  }
}

const results = {};
const exactTokenFrequencies = {};
tokens.forEach(t => exactTokenFrequencies[t] = 0);

Object.entries(PROFILObject.entries(PROFILObject.entries(PROFILObject.entries(PROFILcales.forEach(loc => {
    if (locales[loc]) {
      const occurrences = [];
      traverseAndFind(locales[loc], loc, occurrences);
      i      i      i      i      {
        if        if        if        if        if        if        if        if      l }) => {
                                                     });
                                                   );
      }
    }
  });
});

// Group by locale with unique matching string excerpts and counts
console.log("=== ENGLISH LEAKAGE AUDIT RESULTS ===");
targetLocales.forEach(loc => {
  const list = results[loc] || [];
  console.log(`\nLocale: ${loc.toUpperCase()} (Total matches: ${list.length})`);
  if (list.length === 0) {
    console.log("  No matches.");
    return;
  }
  }
return;
log("  No matches.");
pperCase()} (Total matches: ${list.ew Set(list.map(itemp=> item.val))];
  console.log(`  Unique matching strings (${uniqueStrings.length}):`);
  uniqueStrings.forEach(str => {
    // Show matching tokens in this string
    const matchingTokens = tokens.filter(tok => new RegExp(`\\b${tok}\\b`, 'i').test(str));
    console.log(`    - "${str.trim()}" [Matched: ${matchingTokens.join(', ')}]`);
  });
});

console.log("\n=== EXACT TOKEN FREQUENCIES (Across all non-English locales) ===");
Object.entries(exactToObject.entries(exactToObject.entries(exactToOb  if (countObject.entries(exactToObject.entries(excount}`);
  }
});
