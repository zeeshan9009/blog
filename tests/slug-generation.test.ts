/**
 * Test Suite: Challenge Slug Generation & Collision Handling
 * Tests clean slug derivation, special character stripping, emoji fallback, and duplicate collision resolution.
 */

function generateSlugClientSide(title: string, existingSlugs: string[] = []): string {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!baseSlug) {
    baseSlug = 'challenge-test001';
  }

  let finalSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(finalSlug)) {
    counter++;
    finalSlug = `${baseSlug}-${counter}`;
  }

  return finalSlug;
}

function runTests() {
  console.log('🧪 Running Slug Generation Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, description: string) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
    }
  }

  // 1. Standard Title
  const slug1 = generateSlugClientSide('Next.js 15 & AI Agent Interface Challenge');
  assert(slug1 === 'next-js-15-ai-agent-interface-challenge', 'Formats standard title with special characters into clean kebab-case');

  // 2. Collision Handling
  const existing = ['next-js-15-ai-agent-interface-challenge', 'next-js-15-ai-agent-interface-challenge-2'];
  const slug2 = generateSlugClientSide('Next.js 15 & AI Agent Interface Challenge', existing);
  assert(slug2 === 'next-js-15-ai-agent-interface-challenge-3', 'Auto-increments suffix on collision (-3)');

  // 3. Emoji-only Title Fallback
  const slug3 = generateSlugClientSide('🚀🔥👑');
  assert(slug3.startsWith('challenge-'), 'Falls back to challenge- prefix when title is all emojis/symbols');

  // 4. Trailing and Leading Special Characters
  const slug4 = generateSlugClientSide('--- Fullstack Challenge Arena !!! ---');
  assert(slug4 === 'fullstack-challenge-arena', 'Trims leading and trailing hyphens cleanly');

  // 5. Mixed Case and Numbers
  const slug5 = generateSlugClientSide('Web3 Python 3.12 Fast API Microservices');
  assert(slug5 === 'web3-python-3-12-fast-api-microservices', 'Preserves numbers and converts uppercase to lowercase');

  console.log(`\n🎉 Test Results: ${passed}/${total} assertions passed successfully!`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
