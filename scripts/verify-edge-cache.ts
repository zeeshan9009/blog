/**
 * Edge / CDN Cache Verification Script
 * Probes the live Vercel endpoint sequentially to inspect x-vercel-cache, age, and latency
 */

const TARGET_URL = process.argv[2] || 'https://blog-rho-steel-30.vercel.app/api/search?q=React';

async function verifyCache() {
  console.log(`================================================================`);
  console.log(`🧪 PROBING VERCEL EDGE CDN CACHE FOR:`);
  console.log(`   ${TARGET_URL}`);
  console.log(`================================================================\n`);

  for (let i = 1; i <= 3; i++) {
    console.log(`--- [HIT ATTEMPT #${i}] ---`);
    const startTime = performance.now();
    try {
      const response = await fetch(TARGET_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (RankLancr Edge Cache Auditor)'
        }
      });
      const endTime = performance.now();
      const latencyMs = Number((endTime - startTime).toFixed(2));
      const bodyText = await response.text();

      console.log(`Status:            ${response.status} ${response.statusText}`);
      console.log(`Roundtrip Latency: ${latencyMs} ms`);
      console.log(`x-vercel-cache:    ${response.headers.get('x-vercel-cache') || 'NOT_PRESENT'}`);
      console.log(`cache-control:     ${response.headers.get('cache-control') || 'NOT_PRESENT'}`);
      console.log(`cdn-cache-control: ${response.headers.get('cdn-cache-control') || 'NOT_PRESENT'}`);
      console.log(`age:               ${response.headers.get('age') || 'NOT_PRESENT'}`);
      console.log(`x-vercel-id:       ${response.headers.get('x-vercel-id') || 'NOT_PRESENT'}`);
      console.log(`content-length:    ${response.headers.get('content-length') || bodyText.length} bytes`);
      console.log(`date:              ${response.headers.get('date')}`);
      console.log(`Response Snippet:  ${bodyText.substring(0, 120)}...\n`);
    } catch (err: any) {
      console.error(`Attempt #${i} Failed:`, err?.message);
    }

    // Wait 1 second before the next request
    if (i < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

verifyCache();
