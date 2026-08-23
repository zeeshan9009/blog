const candidates = [
  'prorankr',
  'ranklancr',
  'uplancehub',
  'gigrankr',
  'prolancein',
  'workpulsehub',
  'talentgridx',
  'giglancepro',
  'uplinkly',
  'prolancegrid',
  'vettedrank',
  'uplancepro',
  'hirelancex',
  'skillrankr',
  'linklancepro',
  'freelanceprohub',
  'prolinkspot',
  'upvettedpro',
  'ranktalentx',
  'giglinkr'
];

const extensions = ['.com', '.io', '.co', '.dev'];

interface DomainStatus {
  domain: string;
  isAvailable: boolean;
}

async function checkDomainGoogleDns(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return false;
    const data = await res.json();
    
    // Status 3 = NXDOMAIN (Domain does NOT exist / Unregistered)
    // Status 0 with empty Answer = No A records (possibly unregistered or parked)
    if (data.Status === 3) {
      return true; // Available
    }
    return false; // Registered / Taken
  } catch (err) {
    return false;
  }
}

async function runCheck() {
  console.log('\n🔍 ========================================================');
  console.log('   VERIFYING DOMAINS VIA LIVE GOOGLE DNS ENGINE');
  console.log('========================================================\n');

  for (const name of candidates) {
    const checks = await Promise.all(
      extensions.map(async ext => {
        const domain = `${name}${ext}`;
        const avail = await checkDomainGoogleDns(domain);
        return { ext, domain, avail };
      })
    );

    const availableExts = checks.filter(c => c.avail).map(c => c.ext);
    
    if (availableExts.includes('.com') && availableExts.includes('.io')) {
      console.log(`🔥 [AVAILABLE .com + .io] -> "${name}" (${availableExts.join(', ')})`);
    } else if (availableExts.length >= 2) {
      console.log(`✅ [AVAILABLE MULTI-TLD]  -> "${name}" (${availableExts.join(', ')})`);
    }
  }

  console.log('\n========================================================\n');
}

runCheck();
