export interface ToolItem {
    id: string;
    name: string;
    slug: string;
    path: string;
    sequence: 1 | 2 | 3 | 4 | 5;
    category: "Core" | "Data & Auth" | "SEO & Web" | "Data Generation" | "HTTP & Network";
    shortDesc: string;
    longDesc: string;
    h1: string;
    seoTitle: string;
    metaDescription: string;
    keywords: string[];
    isAvailable: boolean;
    iconName: string;
    features: string[];
    howToSteps: { title: string; desc: string }[];
    faqs: { question: string; answer: string }[];
    relatedSlugs: string[];
}

export const TOOLS_CATALOG: ToolItem[] = [
    // Sequence 1 — Core Developer Tools
    {
        id: "json-formatter",
        name: "JSON Formatter & Validator",
        slug: "json-formatter",
        path: "/tools/json-formatter",
        sequence: 1,
        category: "Core",
        shortDesc: "Format, validate, prettify, and minify your JSON data with instant syntax error detection.",
        longDesc: "A lightning-fast, secure online JSON Formatter, Beautifier, and Validator. Debug syntax errors, format with custom indentation, inspect tree views, and download clean JSON files without uploading your sensitive data to any server.",
        h1: "JSON Formatter & Validator",
        seoTitle: "JSON Formatter & Validator – Free Online JSON Beautifier & Lint",
        metaDescription: "Format, validate, beautify and minify JSON data online in real time. Features syntax error line detection, tree viewer, file download, and zero server logging.",
        keywords: ["json formatter", "json validator", "beautify json", "json linter", "minify json", "json parser online", "json tree view"],
        isAvailable: true,
        iconName: "Braces",
        features: [
            "Real-time syntax validation with line and column error indicators",
            "Beautify with 2-space, 4-space, or tab indentation options",
            "Minify JSON into a compact, single-line format",
            "Tree inspector to collapse and expand nested objects and arrays",
            "File drag-and-drop support & instant .json file downloads",
            "100% Client-side processing — your confidential data never leaves your browser"
        ],
        howToSteps: [
            {
                title: "1. Paste or Upload your JSON",
                desc: "Paste raw JSON text into the input editor or drag and drop your .json file directly."
            },
            {
                title: "2. Choose Formatting Options",
                desc: "Click 'Format' to beautify with chosen indentation, or 'Minify' to remove all whitespaces."
            },
            {
                title: "3. Inspect & Debug",
                desc: "If your JSON has invalid syntax, the tool highlights the exact line and character where the error occurred."
            },
            {
                title: "4. Copy or Download",
                desc: "Copy the clean output with one click or download it as a validated .json file."
            }
        ],
        faqs: [
            {
                question: "Is my JSON data safe when using this tool?",
                answer: "Yes, 100%. All formatting, parsing, and validation happen entirely inside your local web browser. No data is ever sent to or stored on any external server."
            },
            {
                question: "How does the syntax error highlighter work?",
                answer: "Our parser detects exact parse failures from the browser's native engine, pinpointing the invalid line number, column, and unexpected token so you can fix it instantly."
            },
            {
                question: "Can I convert large JSON files?",
                answer: "Yes! The tool is optimized for performance and can effortlessly parse and format multi-megabyte JSON payloads without freezing your browser."
            }
        ],
        relatedSlugs: ["api-tester", "url-encoder", "csv-to-json", "json-to-csv"]
    },
    {
        id: "api-tester",
        name: "API Tester (REST Client)",
        slug: "api-tester",
        path: "/tools/api-tester",
        sequence: 1,
        category: "Core",
        shortDesc: "Send HTTP requests, test REST APIs, manage headers and auth, and inspect responses.",
        longDesc: "A lightweight, web-based Postman alternative. Test RESTful APIs, customize HTTP methods (GET, POST, PUT, DELETE, PATCH), set headers, Bearer tokens, Basic Auth, pass JSON request payloads, and view real-time latency and status codes.",
        h1: "Online REST API Tester & HTTP Client",
        seoTitle: "Online API Tester – Lightweight Web REST Client & Postman Alternative",
        metaDescription: "Test REST APIs directly from your browser. Send GET, POST, PUT, DELETE requests with custom headers, query params, auth, and inspect formatted JSON responses & latency.",
        keywords: ["api tester", "online rest client", "http request tester", "postman online alternative", "test api online", "curl tester"],
        isAvailable: true,
        iconName: "Send",
        features: [
            "Supports GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS methods",
            "Interactive Query Parameters and Headers key-value builder",
            "Authentication support: Bearer Token and Basic Auth credentials",
            "Raw JSON request body editor with auto-formatting",
            "Real-time HTTP Status Code badges, response timing in milliseconds, and payload size",
            "Export any prepared request as a ready-to-use cURL command"
        ],
        howToSteps: [
            {
                title: "1. Select Method & Enter URL",
                desc: "Choose an HTTP method (e.g. GET or POST) and enter your target API endpoint."
            },
            {
                title: "2. Configure Headers & Auth",
                desc: "Add custom HTTP headers or authorization credentials in the corresponding tabs."
            },
            {
                title: "3. Provide Request Body (if needed)",
                desc: "For POST/PUT/PATCH requests, switch to the Body tab and provide your JSON payload."
            },
            {
                title: "4. Send and Analyze",
                desc: "Hit 'Send Request' to inspect formatted JSON response, status code, response time, and headers."
            }
        ],
        faqs: [
            {
                question: "How are browser CORS restrictions handled?",
                answer: "Direct browser requests require CORS headers from target servers. For testing without CORS limits, you can test public APIs (like JSONPlaceholder, GitHub, etc.) or connect to your local dev servers."
            },
            {
                question: "Can I generate a cURL command from my request?",
                answer: "Yes! Click the 'Copy cURL' button at any time to get the complete terminal cURL command with all headers, params, and body data."
            }
        ],
        relatedSlugs: ["webhook-tester", "json-formatter", "http-header-checker", "api-response-formatter"]
    },
    {
        id: "webhook-tester",
        name: "Webhook Tester & Debugger",
        slug: "webhook-tester",
        path: "/tools/webhook-tester",
        sequence: 1,
        category: "Core",
        shortDesc: "Generate unique webhook URLs, receive and inspect real-time HTTP POST/GET payloads.",
        longDesc: "Test, inspect, and debug incoming webhooks from Stripe, GitHub, Shopify, Slack, and custom backend applications. Generate temporary unique URLs, capture incoming requests live, and view headers, query parameters, and JSON payloads.",
        h1: "Webhook Tester & Real-Time HTTP Catcher",
        seoTitle: "Webhook Tester – Online Webhook Receiver & Debugger",
        metaDescription: "Generate instant webhook URLs to test and debug incoming HTTP requests. View live request headers, JSON payloads, query params from Stripe, GitHub, and Shopify.",
        keywords: ["webhook tester", "webhook debugger", "test webhooks online", "webhook receiver", "catch http requests", "stripe webhook test"],
        isAvailable: true,
        iconName: "Webhook",
        features: [
            "Generate instant, unique webhook endpoints with a single click",
            "Live request inbox capturing timestamps, HTTP methods, and status codes",
            "Deep payload inspection: Headers, Query strings, Raw Body, and Formatted JSON",
            "Pre-built webhook simulators for Stripe, GitHub, and Slack events",
            "Request history management: copy payload, clear history, or export raw data",
            "Auto-listen mode for hassle-free background testing"
        ],
        howToSteps: [
            {
                title: "1. Generate your Webhook URL",
                desc: "Click 'Generate Webhook URL' to create a unique test endpoint."
            },
            {
                title: "2. Configure in your 3rd-Party Service",
                desc: "Copy your endpoint and paste it into Stripe, GitHub, or your API webhook settings."
            },
            {
                title: "3. Trigger an Event",
                desc: "Send a request via cURL or trigger an action in your external service."
            },
            {
                title: "4. Inspect the Payload",
                desc: "Watch the request arrive in real time and inspect all headers, query parameters, and JSON payload."
            }
        ],
        faqs: [
            {
                question: "What types of HTTP methods are supported?",
                answer: "The webhook catcher accepts POST, GET, PUT, PATCH, and DELETE requests."
            },
            {
                question: "Can I simulate webhook payloads directly in the browser?",
                answer: "Yes! We provide built-in mock event triggers for Stripe (Payment Succeeded), GitHub (Push Event), and Slack (Message) so you can test without external configuration."
            }
        ],
        relatedSlugs: ["api-tester", "json-formatter", "http-header-checker", "jwt-decoder"]
    },
    {
        id: "url-encoder",
        name: "URL Encoder / Decoder",
        slug: "url-encoder",
        path: "/tools/url-encoder",
        sequence: 1,
        category: "Core",
        shortDesc: "Encode or decode URLs and query parameters with percent-encoding and component options.",
        longDesc: "Free online URL encoder and decoder. Convert special characters into percent-encoded formats (RFC 3986) or restore encoded URL strings into readable text. Includes full URL decomposition, query parameter breakdown, and instant swap tools.",
        h1: "URL Encoder & Decoder Online",
        seoTitle: "URL Encoder / Decoder – Free Online Percent-Encoding Tool",
        metaDescription: "Encode and decode URLs and URI components online. Supports full URI encoding, query param decoding, URL breakdown analysis, and live conversion.",
        keywords: ["url encoder", "url decoder", "percent encoding", "encodeuricomponent online", "decode url online", "uri encoder"],
        isAvailable: true,
        iconName: "Link2",
        features: [
            "Encode and decode standard URLs (encodeURI / decodeURI)",
            "Component encoding for query parameters and values (encodeURIComponent / decodeURIComponent)",
            "Live conversion mode as you type",
            "URL Inspector breakdown (Protocol, Hostname, Path, Query Parameters table)",
            "One-click Swap Input & Output functionality",
            "Character count and length change statistics"
        ],
        howToSteps: [
            {
                title: "1. Enter URL or Text",
                desc: "Type or paste your plain or encoded URL string into the input area."
            },
            {
                title: "2. Select Encode or Decode Mode",
                desc: "Choose between URL Mode (standard URI) or Component Mode (query parameters)."
            },
            {
                title: "3. Inspect Analyzed Structure",
                desc: "View the URL structure breakdown table showing protocol, host, path, and key-value params."
            },
            {
                title: "4. Copy Result",
                desc: "Copy the converted URL string to your clipboard with one click."
            }
        ],
        faqs: [
            {
                question: "What is the difference between encodeURI and encodeURIComponent?",
                answer: "encodeURI preserves special URL characters like '/', '?', and '&' for full URLs, while encodeURIComponent encodes everything including slashes and ampersands, making it ideal for query parameter values."
            },
            {
                question: "Why do URLs need percent-encoding?",
                answer: "Certain characters (spaces, quotes, non-ASCII symbols) cannot be transmitted safely in internet URLs without being converted into % followed by two hex digits."
            }
        ],
        relatedSlugs: ["base64-encoder", "api-tester", "json-formatter", "http-header-checker"]
    },

    // Sequence 2 — Data & Auth Tools
    {
        id: "base64-encoder",
        name: "Base64 Encoder / Decoder",
        slug: "base64-encoder",
        path: "/tools/base64-encoder",
        sequence: 2,
        category: "Data & Auth",
        shortDesc: "Encode text and files to Base64 or decode Base64 strings back to original format.",
        longDesc: "Encode and decode Base64 data securely in your browser. Supports UTF-8 strings, Unicode/emojis, image & file to Base64 conversion, URL-safe Base64 (RFC 4648), and instant file downloads.",
        h1: "Base64 Encoder & Decoder Online",
        seoTitle: "Base64 Encoder & Decoder – Convert Text, Images & Files Online",
        metaDescription: "Encode text and files into Base64 format or decode Base64 strings. Client-side, secure, and supports UTF-8, binary formats, image previews, and URL-safe Base64.",
        keywords: ["base64 encoder", "base64 decoder", "file to base64", "base64 to image", "base64 image decoder", "url safe base64"],
        isAvailable: true,
        iconName: "Binary",
        features: [
            "Text to Base64 encoding with UTF-8 & Emoji character support",
            "Base64 to plain readable Text decoding",
            "File to Base64 converter with Data URI output (data:image/png;base64,...)",
            "Base64 to downloadable file with automatic MIME type detection",
            "URL-Safe Base64 mode (replaces +/ with -_ and strips padding =)",
            "100% Client-side processing with zero server uploads"
        ],
        howToSteps: [
            {
                title: "1. Select Text or File Mode",
                desc: "Choose whether you want to encode/decode plain text or convert images/documents."
            },
            {
                title: "2. Input your Data",
                desc: "Type or paste your text/Base64 string or drag and drop your file into the canvas."
            },
            {
                title: "3. Choose Encoding Format",
                desc: "Toggle standard RFC 4648 Base64 or URL-Safe Base64 format as needed."
            },
            {
                title: "4. Copy or Download",
                desc: "Copy the result with one click or download it directly as a decoded binary file."
            }
        ],
        faqs: [
            {
                question: "Does this tool support Unicode and emoji characters?",
                answer: "Yes! Our encoder uses UTF-8 byte serialization, ensuring international characters, special symbols, and emojis encode and decode accurately without garbled text."
            },
            {
                question: "What is URL-Safe Base64?",
                answer: "Standard Base64 contains '+' and '/' which have special meanings in URLs. URL-Safe Base64 replaces '+' with '-' and '/' with '_', and strips '=' padding so it can be safely used in query parameters and JWT tokens."
            }
        ],
        relatedSlugs: ["jwt-decoder", "url-encoder", "json-formatter", "api-tester"]
    },
    {
        id: "jwt-decoder",
        name: "JWT Decoder & Inspector",
        slug: "jwt-decoder",
        path: "/tools/jwt-decoder",
        sequence: 2,
        category: "Data & Auth",
        shortDesc: "Decode and inspect JSON Web Tokens (JWT) headers, payloads, and expiration times.",
        longDesc: "Inspect and debug JSON Web Tokens (JWT) securely in your browser. View color-coded token segments, decoded header algorithms, payload claims, expiration countdowns, and token timestamps without sharing secrets.",
        h1: "JWT Decoder & Token Inspector",
        seoTitle: "JWT Decoder – Decode & Inspect JSON Web Tokens Online",
        metaDescription: "Free online JWT token decoder. View Header and Payload claims, check expiration status in real time, and format timestamps instantly.",
        keywords: ["jwt decoder", "decode jwt online", "json web token parser", "jwt inspector", "jwt expiration check"],
        isAvailable: true,
        iconName: "KeyRound",
        features: [
            "3-Part Color-coded Token Splitter (Header = Rose, Payload = Purple, Signature = Cyan)",
            "Formatted JSON views for Header and Payload claims",
            "Live Expiration check with active/expired badges and time countdown",
            "Issued-At (iat) and Not-Before (nbf) human-friendly date translations",
            "Pre-loaded sample tokens (Standard User, Firebase Auth, Expired Token)",
            "100% Client-side token inspection — your secrets never leave your device"
        ],
        howToSteps: [
            {
                title: "1. Paste your JWT Token",
                desc: "Paste an encoded JSON Web Token (e.g. eyJhbGciOi...) into the token input box."
            },
            {
                title: "2. Inspect Header & Claims",
                desc: "View the decoded algorithm (alg), token type (typ), and payload key-value claims."
            },
            {
                title: "3. Verify Expiration Status",
                desc: "Check the live expiration status badge to see if the token is valid or expired."
            },
            {
                title: "4. Copy Decoded JSON",
                desc: "Copy either the full decoded payload or specific claim values for your API debugging."
            }
        ],
        faqs: [
            {
                question: "Does this tool verify the cryptographic signature?",
                answer: "This tool is an inspector and decoder. Signature verification requires your private secret key, which should never be pasted into any web interface for security reasons."
            },
            {
                question: "Is my JWT token transmitted to any server?",
                answer: "No. The decoding and parsing happen entirely inside your local browser's JavaScript memory."
            }
        ],
        relatedSlugs: ["base64-encoder", "json-formatter", "api-tester", "webhook-tester"]
    },
    {
        id: "regex-tester",
        name: "Regex Tester & Highlighter",
        slug: "regex-tester",
        path: "/tools/regex-tester",
        sequence: 2,
        category: "Data & Auth",
        shortDesc: "Test regular expressions with real-time match highlighting, capture groups, and flag controls.",
        longDesc: "Interactive online RegEx tester and debugger. Evaluate regular expressions in real-time with live text match highlighting, capture group extraction, flag controls (g, i, m, s, u), and ready-to-use regex presets.",
        h1: "Regular Expression (RegEx) Tester & Highlighter",
        seoTitle: "Regex Tester – Test & Debug Regular Expressions Online with Live Highlight",
        metaDescription: "Test regular expressions online with live match highlighting, capture group inspector, flags toggle, and common regex pattern presets.",
        keywords: ["regex tester", "regular expression online", "regex cheat sheet", "regex highlighter", "regex capture groups"],
        isAvailable: true,
        iconName: "SearchCode",
        features: [
            "Live real-time regex matching and colorized match highlighting",
            "Detailed capture groups tree inspector with match start and end indices",
            "Interactive Flags Manager: Global (g), Case-insensitive (i), Multiline (m), DotAll (s), Unicode (u)",
            "Pre-built regex library: Email, URLs, IPv4, Phone numbers, Dates, Strong Passwords, Hex colors",
            "Detailed error detection and syntax explanations for invalid expressions",
            "Copy matched strings or replacement output"
        ],
        howToSteps: [
            {
                title: "1. Enter Regular Expression",
                desc: "Type your regex pattern (e.g. ^[a-z0-9]+@[a-z]+\\.[a-z]{2,}$) in the pattern input."
            },
            {
                title: "2. Set Regex Flags",
                desc: "Toggle active flags such as 'g' for all matches or 'i' for case-insensitive matching."
            },
            {
                title: "3. Provide Test String",
                desc: "Paste sample text into the test area and watch matching phrases highlight instantly."
            },
            {
                title: "4. Inspect Capture Groups",
                desc: "Expand the match details list to inspect matched segments and numbered capture groups."
            }
        ],
        faqs: [
            {
                question: "Which RegEx engine is used?",
                answer: "The tester uses the native ECMAScript (JavaScript) Regular Expression engine, providing 100% compatibility with modern web and Node.js environments."
            },
            {
                question: "What does the 'g' flag do?",
                answer: "The 'g' (global) flag finds all occurrences of the pattern in the test string rather than stopping after the first match."
            }
        ],
        relatedSlugs: ["cron-generator", "json-formatter", "url-encoder", "api-tester"]
    },
    {
        id: "cron-generator",
        name: "Cron Expression Generator",
        slug: "cron-generator",
        path: "/tools/cron-generator",
        sequence: 2,
        category: "Data & Auth",
        shortDesc: "Generate, build, and translate cron schedule expressions into plain human-readable English.",
        longDesc: "Visual cron expression generator and schedule builder. Create standard 5-field crontab expressions visually, read human-friendly English translations, inspect the next 5 execution times, and use pre-configured schedule presets.",
        h1: "Cron Expression Generator & Visual Crontab Builder",
        seoTitle: "Cron Expression Generator – Visual Crontab Builder & Next Execution Calculator",
        metaDescription: "Generate and translate crontab schedule expressions visually. Read human-friendly translations, inspect next execution times, and copy clean cron syntax.",
        keywords: ["cron expression generator", "crontab builder", "cron syntax translator", "cron schedule generator", "cron next execution times"],
        isAvailable: true,
        iconName: "Clock",
        features: [
            "Visual builder tabs for Minutes, Hours, Day of Month, Month, and Day of Week",
            "Real-time human-readable translation into plain English",
            "Calculation of the next 5 upcoming scheduled execution timestamps",
            "Bidirectional editing: type raw cron syntax or adjust visual sliders and checkboxes",
            "Pre-configured schedule presets (Every 5 mins, Hourly, Daily at midnight, Weekly, Monthly)",
            "One-click crontab line copy and CLI crontab snippet"
        ],
        howToSteps: [
            {
                title: "1. Choose a Schedule Preset or Visual Tab",
                desc: "Select a common preset (e.g. Daily at midnight) or switch tabs to build a custom schedule."
            },
            {
                title: "2. Configure Timing Fields",
                desc: "Pick specific hours, minutes, weekdays, or intervals using the interactive controls."
            },
            {
                title: "3. Read English Translation",
                desc: "Review the plain English explanation to verify your schedule matches your exact intention."
            },
            {
                title: "4. Check Next Run Times & Copy",
                desc: "Confirm upcoming execution dates in the timeline and copy the 5-field cron expression."
            }
        ],
        faqs: [
            {
                question: "What is the standard cron format supported?",
                answer: "The tool generates standard 5-field Unix/Linux crontab format: [Minute] [Hour] [Day of Month] [Month] [Day of Week]."
            },
            {
                question: "How do step values work in cron (e.g. */15)?",
                answer: "A slash '/' denotes step values. For example, '*/15' in the minute field triggers every 15 minutes (at :00, :15, :30, and :45)."
            }
        ],
        relatedSlugs: ["regex-tester", "api-tester", "webhook-tester", "json-formatter"]
    },

    // Sequence 3 — SEO / Web Crawler Tools
    {
        id: "robots-txt-generator",
        name: "robots.txt Generator",
        slug: "robots-txt-generator",
        path: "/tools/robots-txt-generator",
        sequence: 3,
        category: "SEO & Web",
        shortDesc: "Create and validate customized robots.txt files for search engine crawlers.",
        longDesc: "Generate SEO-optimized robots.txt files. Specify allow and disallow crawl directives for Googlebot, Bingbot, and other web crawlers, add crawl delays, link XML sitemaps, and use ready-to-deploy presets.",
        h1: "robots.txt Generator & Validator",
        seoTitle: "robots.txt Generator – Create & Validate Robots Files for SEO Online",
        metaDescription: "Generate and customize robots.txt files for Googlebot, Bingbot, and other search crawlers. Add allow/disallow directives, crawl-delays, and sitemap URLs.",
        keywords: ["robots txt generator", "create robots txt", "seo crawler rules", "robots txt validator", "googlebot disallow"],
        isAvailable: true,
        iconName: "Bot",
        features: [
            "Visual Allow and Disallow rules builder with instant path inputs",
            "Pre-configured User-Agent bot selector (Googlebot, Bingbot, Baiduspider, Twitterbot)",
            "Direct XML Sitemap linking directive (Sitemap: https://...)",
            "Optional Crawl-delay timing parameter",
            "One-click presets (Allow All, Block Staging/Private, WordPress CMS, E-Commerce)",
            "Copy and download formatted robots.txt file"
        ],
        howToSteps: [
            {
                title: "1. Choose a Preset or Start Fresh",
                desc: "Select a common scenario (e.g. Standard Public Website, WordPress, or Block All)."
            },
            {
                title: "2. Define Allow & Disallow Paths",
                desc: "Add specific directories or query URLs you want to hide from search engine indexers."
            },
            {
                title: "3. Add your Sitemap URL",
                desc: "Provide your XML sitemap URL to guide search bots directly to your content pages."
            },
            {
                title: "4. Download & Upload to Root",
                desc: "Download robots.txt and place it in the root directory of your website domain."
            }
        ],
        faqs: [
            {
                question: "Where should the robots.txt file be uploaded?",
                answer: "The robots.txt file must always be placed in the top-level root directory of your website (e.g. https://yourdomain.com/robots.txt)."
            },
            {
                question: "Does robots.txt completely protect private pages from being accessed?",
                answer: "No. robots.txt is a directive for search crawlers, not an access control system. Use proper user authentication and password protection for truly private or sensitive data."
            }
        ],
        relatedSlugs: ["sitemap-generator", "html-to-markdown", "http-header-checker", "url-encoder"]
    },
    {
        id: "sitemap-generator",
        name: "XML Sitemap Generator",
        slug: "sitemap-generator",
        path: "/tools/sitemap-generator",
        sequence: 3,
        category: "SEO & Web",
        shortDesc: "Generate Google-compliant XML sitemaps with priorities, change frequencies, and dates.",
        longDesc: "Quickly generate well-formed XML sitemaps for your website to boost search engine indexing and discoverability. Configure priority scores, change frequencies, and last-modified dates.",
        h1: "XML Sitemap Generator for Search Engines",
        seoTitle: "XML Sitemap Generator – Free Online Sitemap Builder for Google & Bing",
        metaDescription: "Build XML sitemaps with custom page priority, change frequency, and last-modified dates for Google Search Console and Bing Webmaster Tools.",
        keywords: ["sitemap generator", "xml sitemap builder", "seo sitemap creator", "generate sitemap xml online", "google sitemap format"],
        isAvailable: true,
        iconName: "FileCode2",
        features: [
            "Interactive URL entry table and multi-line batch URL importer",
            "Page Priority scoring controls (0.1 to 1.0)",
            "Change Frequency selector (always, hourly, daily, weekly, monthly, yearly)",
            "Automatic or custom Last-Modified (lastmod) date formatting",
            "Google-compliant sitemaps.org XML 0.9 schema formatting",
            "One-click Copy and download sitemap.xml file"
        ],
        howToSteps: [
            {
                title: "1. Add your Website URLs",
                desc: "Type or paste your website URLs into the URL manager or use the bulk paste tool."
            },
            {
                title: "2. Set Priority & Change Frequency",
                desc: "Assign higher priority (e.g. 1.0 or 0.8) to important landing pages and choose update frequencies."
            },
            {
                title: "3. Generate XML Structure",
                desc: "Review the formatted XML output preview and verify Google compliance."
            },
            {
                title: "4. Download & Submit to Search Console",
                desc: "Download your sitemap.xml and submit the link in Google Search Console."
            }
        ],
        faqs: [
            {
                question: "What is an XML Sitemap used for?",
                answer: "An XML Sitemap informs search engines like Google and Bing about all the crawlable pages on your site, helping them index your content faster and more thoroughly."
            },
            {
                question: "What is the recommended priority for a homepage?",
                answer: "The homepage is usually given a priority of 1.0, key category or feature pages 0.8, and standard blog posts or utility pages 0.5 to 0.6."
            }
        ],
        relatedSlugs: ["robots-txt-generator", "html-to-markdown", "url-encoder", "http-header-checker"]
    },
    {
        id: "html-to-markdown",
        name: "HTML to Markdown Converter",
        slug: "html-to-markdown",
        path: "/tools/html-to-markdown",
        sequence: 3,
        category: "SEO & Web",
        shortDesc: "Convert raw HTML code and web pages into clean Markdown formatting.",
        longDesc: "Transform HTML markup into clean GitHub Flavored Markdown (GFM). Preserves headers, links, lists, code blocks, images, blockquotes, and HTML tables with real-time conversion.",
        h1: "HTML to Markdown Converter",
        seoTitle: "HTML to Markdown Converter – Clean GFM Output & Live Conversion",
        metaDescription: "Convert HTML elements and pages into clean, formatted Markdown. Preserves tables, links, images, headings, and code fences.",
        keywords: ["html to markdown", "convert html to md", "html markdown converter", "html to gfm", "html to markdown table"],
        isAvailable: true,
        iconName: "FileText",
        features: [
            "Real-time client-side HTML to Markdown parsing",
            "Full support for Headings (H1-H6), bold, italic, and strikethrough",
            "HTML Table to Markdown GFM table grid conversion",
            "Ordered and unordered list transformation with indentation",
            "Code block and inline code formatting preservation",
            "One-click Copy and download .md file"
        ],
        howToSteps: [
            {
                title: "1. Paste HTML Markup",
                desc: "Paste raw HTML snippets or copied web page elements into the editor."
            },
            {
                title: "2. Real-Time Conversion",
                desc: "The parser instantly translates HTML tags into standard Markdown syntax."
            },
            {
                title: "3. Review & Edit",
                desc: "Inspect the generated markdown in the output canvas."
            },
            {
                title: "4. Copy or Export",
                desc: "Copy the clean markdown text or download it as a .md document."
            }
        ],
        faqs: [
            {
                question: "Does it support complex HTML tables?",
                answer: "Yes! Table rows (<tr>), headers (<th>), and data cells (<td>) are accurately translated into GitHub Flavored Markdown table syntax."
            },
            {
                question: "Are scripts or malicious tags stripped?",
                answer: "Yes. Non-formatting tags like <script> or <style> are ignored, outputting only clean, safe Markdown text."
            }
        ],
        relatedSlugs: ["markdown-to-html", "robots-txt-generator", "json-formatter"]
    },
    {
        id: "markdown-to-html",
        name: "Markdown to HTML Converter",
        slug: "markdown-to-html",
        path: "/tools/markdown-to-html",
        sequence: 3,
        category: "SEO & Web",
        shortDesc: "Convert Markdown syntax into clean, semantic HTML code with live preview.",
        longDesc: "Write or paste Markdown and generate semantic, standard HTML markup with live visual preview, task lists, tables, syntax rendering, and export options.",
        h1: "Markdown to HTML Converter & Live Preview",
        seoTitle: "Markdown to HTML Converter – Real-time GFM HTML Generator & Preview",
        metaDescription: "Convert Markdown to clean HTML code with instant live preview. Supports GitHub Flavored Markdown, checklists, tables, and code highlighting.",
        keywords: ["markdown to html", "convert md to html", "markdown live preview", "gfm to html converter", "markdown table to html"],
        isAvailable: true,
        iconName: "Code2",
        features: [
            "Live side-by-side rendered visual preview and semantic HTML code output",
            "GitHub Flavored Markdown (GFM) tables, checklists (- [x]), and strikethrough",
            "Syntax-styled code blocks and blockquote styling",
            "Pre-loaded templates (Project README, Technical Doc, Release Notes)",
            "Copy formatted HTML or download as a standalone .html file",
            "100% Client-side processing with high rendering performance"
        ],
        howToSteps: [
            {
                title: "1. Write or Paste Markdown",
                desc: "Type Markdown syntax or paste an existing .md file into the editor."
            },
            {
                title: "2. Inspect Live Visual Preview",
                desc: "Switch between the rendered interactive preview and raw HTML markup tabs."
            },
            {
                title: "3. Choose HTML Formatting",
                desc: "Review the clean, semantic HTML elements generated automatically."
            },
            {
                title: "4. Copy or Download",
                desc: "Copy the HTML snippet to embed in your CMS or download as an .html file."
            }
        ],
        faqs: [
            {
                question: "Does this support GitHub Flavored Markdown (GFM)?",
                answer: "Yes! Tables, task lists, strikethrough (~~text~~), and fenced code blocks are fully supported."
            },
            {
                question: "Can I use the output directly in WordPress or static sites?",
                answer: "Yes. The generated HTML uses standard semantic tags (<h1>, <p>, <ul>, <blockquote>, <table>) that easily integrate into any CMS or web framework."
            }
        ],
        relatedSlugs: ["html-to-markdown", "robots-txt-generator", "json-formatter"]
    },

    // Sequence 4 — Data Generation & Conversion
    {
        id: "csv-to-json",
        name: "CSV to JSON Converter",
        slug: "csv-to-json",
        path: "/tools/csv-to-json",
        sequence: 4,
        category: "Data Generation",
        shortDesc: "Convert CSV spreadsheets into structured JSON arrays and objects.",
        longDesc: "Parse CSV files and comma/tab-delimited spreadsheets into formatted JSON. Supports automatic delimiter detection, header row extraction, data type inference (numbers/booleans), and multiple output formats (Array of Objects, 2D Array, Keyed Object).",
        h1: "CSV to JSON Converter Online",
        seoTitle: "CSV to JSON Converter – Convert Spreadsheets & Delimited Text to JSON Online",
        metaDescription: "Convert CSV data and spreadsheets into formatted JSON objects or arrays with auto-delimiter detection, type inference, and instant file download.",
        keywords: ["csv to json", "convert csv to json online", "spreadsheet to json", "csv parser json", "tsv to json"],
        isAvailable: true,
        iconName: "FileSpreadsheet",
        features: [
            "Auto delimiter detection (Comma, Semicolon, Tab, Pipe)",
            "Automatic data type parsing (integers, floats, booleans, nulls)",
            "Multiple JSON structures: Array of Objects, Array of Arrays, Keyed by Column",
            "Drag-and-drop CSV file upload & instant .json file downloads",
            "Row, column, and data compression metrics",
            "100% Client-side privacy — confidential spreadsheets never leave your browser"
        ],
        howToSteps: [
            {
                title: "1. Paste CSV or Upload File",
                desc: "Paste raw CSV text or drag and drop your .csv spreadsheet into the canvas."
            },
            {
                title: "2. Choose Delimiter & Options",
                desc: "Select comma, semicolon, tab, or let the parser auto-detect the delimiter."
            },
            {
                title: "3. Select Output Structure",
                desc: "Choose between standard Array of Objects or 2D Array matrix format."
            },
            {
                title: "4. Copy or Download JSON",
                desc: "Copy the formatted JSON string or download it as a ready-to-use .json file."
            }
        ],
        faqs: [
            {
                question: "Can this tool parse TSV (Tab-Separated Values) files?",
                answer: "Yes! Select the 'Tab' delimiter option or use Auto-detect, and your tab-separated data will convert into clean JSON."
            },
            {
                question: "How are quotation marks and commas in values handled?",
                answer: "The parser adheres to RFC 4180 standard, correctly handling fields wrapped in quotes that contain internal commas or escaped quotation marks."
            }
        ],
        relatedSlugs: ["json-to-csv", "json-formatter", "random-data-generator", "uuid-generator"]
    },
    {
        id: "json-to-csv",
        name: "JSON to CSV Converter",
        slug: "json-to-csv",
        path: "/tools/json-to-csv",
        sequence: 4,
        category: "Data Generation",
        shortDesc: "Transform JSON arrays and nested data into downloadable CSV files.",
        longDesc: "Convert JSON array structures into clean, flat CSV format suitable for Microsoft Excel, Google Sheets, and databases. Supports nested key flattening, custom delimiters, and live table preview.",
        h1: "JSON to CSV Converter Online",
        seoTitle: "JSON to CSV Converter – Export JSON Data to Excel & Spreadsheets Online",
        metaDescription: "Convert JSON arrays and nested objects into clean CSV format for Excel and Google Sheets with nested key flattening and live table preview.",
        keywords: ["json to csv", "convert json to csv", "json to excel converter", "flatten json to csv", "export json spreadsheet"],
        isAvailable: true,
        iconName: "FileDown",
        features: [
            "Nested object flattening (e.g. user.address.city to column)",
            "Configurable delimiters: Comma (,), Semicolon (;), Tab (\\t)",
            "Automatic quote escaping for fields containing commas and line breaks",
            "Interactive tabular preview and formatted raw CSV editor",
            "One-click Download .csv and copy to clipboard",
            "100% Client-side conversion for complete data security"
        ],
        howToSteps: [
            {
                title: "1. Paste JSON Data",
                desc: "Paste your JSON array of objects (e.g. [ { 'name': 'Ali', 'age': 25 } ]) into the editor."
            },
            {
                title: "2. Configure Flattening",
                desc: "Toggle 'Flatten Nested Objects' if your JSON contains deeply nested dictionary trees."
            },
            {
                title: "3. Preview Table",
                desc: "Inspect the generated spreadsheet grid in the live preview tab."
            },
            {
                title: "4. Export CSV",
                desc: "Download your clean .csv file ready for Excel, Google Sheets, or database imports."
            }
        ],
        faqs: [
            {
                question: "How does nested object flattening work?",
                answer: "When enabled, nested properties like { 'user': { 'name': 'John' } } are transformed into dot-notation column headers like 'user.name'."
            },
            {
                question: "Will commas in my text values break the CSV columns?",
                answer: "No. Any value containing commas or quotes is automatically wrapped in double quotes according to RFC 4180 specifications."
            }
        ],
        relatedSlugs: ["csv-to-json", "json-formatter", "random-data-generator", "api-tester"]
    },
    {
        id: "uuid-generator",
        name: "UUID / GUID Generator",
        slug: "uuid-generator",
        path: "/tools/uuid-generator",
        sequence: 4,
        category: "Data Generation",
        shortDesc: "Generate random cryptographically secure UUID v4 / GUID identifiers in bulk.",
        longDesc: "Generate single or bulk RFC 4122 compliant UUID v4 identifiers. Features cryptographically secure randomness via Web Crypto API, quantity selector (1 to 500), uppercase/lowercase formats, hyphenless options, and JSON array export.",
        h1: "Online UUID / GUID Generator",
        seoTitle: "UUID Generator – Bulk UUID v4 & GUID Creator Online (1 to 500 IDs)",
        metaDescription: "Generate random, cryptographically secure UUID v4 strings individually or in bulk. Custom formatting options including uppercase, hyphen removal, and JSON array export.",
        keywords: ["uuid generator", "guid generator", "generate uuid v4", "random uuid online", "bulk uuid generator", "rfc 4122 uuid"],
        isAvailable: true,
        iconName: "Fingerprint",
        features: [
            "Cryptographically secure randomness powered by browser Web Crypto API",
            "Bulk generation from 1 up to 500 UUIDs in a single click",
            "Multiple format variations: Standard lowercase, Uppercase, Hyphenless, and JSON Array",
            "Single-click individual copy pill badges and bulk copy",
            "Export options: plain text list or validated .json array file",
            "100% Client-side generation with zero duplicate risk"
        ],
        howToSteps: [
            {
                title: "1. Select Quantity",
                desc: "Choose how many UUIDs you need (e.g. 1, 10, 50, or 100)."
            },
            {
                title: "2. Pick Format Style",
                desc: "Select standard lowercase with hyphens, uppercase, compact hyphenless, or JSON."
            },
            {
                title: "3. Generate Identifiers",
                desc: "Click 'Generate UUIDs' to create fresh cryptographically secure identifiers."
            },
            {
                title: "4. Copy or Download",
                desc: "Click any single UUID badge to copy it, or copy all at once and download as a file."
            }
        ],
        faqs: [
            {
                question: "What is UUID version 4?",
                answer: "UUID v4 is a 128-bit universally unique identifier generated using cryptographic random numbers. The chance of generating a duplicate is approximately 1 in 2.71 quintillion."
            },
            {
                question: "Are these UUIDs safe for production databases?",
                answer: "Yes! They are generated using the browser's cryptographic crypto.getRandomValues() API, making them completely random and RFC 4122 compliant."
            }
        ],
        relatedSlugs: ["random-data-generator", "base64-encoder", "csv-to-json", "api-tester"]
    },
    {
        id: "random-data-generator",
        name: "Mock / Random Data Generator",
        slug: "random-data-generator",
        path: "/tools/random-data-generator",
        sequence: 4,
        category: "Data Generation",
        shortDesc: "Generate realistic mock data (Names, Emails, Addresses, Phones, Dates) in JSON/CSV.",
        longDesc: "Generate realistic sample data for UI prototyping, database seeding, and API mocking. Configure fields across identities, contacts, addresses, companies, and financials, and export as JSON, CSV, or SQL INSERT statements.",
        h1: "Random Mock Data Generator for Developers",
        seoTitle: "Random Data Generator – Generate Mock JSON, CSV & SQL Datasets Online",
        metaDescription: "Generate realistic mock test data including names, emails, addresses, companies, and phone numbers. Export dataset as JSON, CSV, or SQL INSERT queries.",
        keywords: ["random data generator", "mock data generator", "test data creator", "generate fake data", "sql insert generator", "dummy json generator"],
        isAvailable: true,
        iconName: "Shuffle",
        features: [
            "Configurable fields selector (Names, Emails, Usernames, Phones, Addresses, Companies, UUIDs, Dates)",
            "Generate from 10 up to 500 realistic records instantly",
            "Multi-format export: Formatted JSON array, CSV spreadsheet, and SQL INSERT statements",
            "Interactive dataset table preview with pagination and search",
            "One-click Copy and download in chosen format",
            "100% Client-side synthetic data generation"
        ],
        howToSteps: [
            {
                title: "1. Select Fields to Include",
                desc: "Check off the data columns you need (e.g. Full Name, Email, Country, Job Title, UUID)."
            },
            {
                title: "2. Set Record Count",
                desc: "Choose the number of records to generate (e.g. 25, 50, 100, or 250)."
            },
            {
                title: "3. Choose Export Format",
                desc: "Select between JSON (for APIs), CSV (for Excel), or SQL (for database inserts)."
            },
            {
                title: "4. Generate & Download",
                desc: "Click 'Generate Mock Data' and download your test dataset immediately."
            }
        ],
        faqs: [
            {
                question: "Can I generate SQL INSERT queries for MySQL or PostgreSQL?",
                answer: "Yes! Switch to the SQL format tab, specify your target table name, and copy the ready-to-run INSERT INTO queries."
            },
            {
                question: "Is the generated data real user information?",
                answer: "No. All names, emails, and addresses are synthetically generated mock values safe for public demos, testing, and staging databases."
            }
        ],
        relatedSlugs: ["uuid-generator", "csv-to-json", "json-to-csv", "json-formatter"]
    },

    // Sequence 5 — HTTP / Network / API Tools
    {
        id: "http-header-checker",
        name: "HTTP Header Checker",
        slug: "http-header-checker",
        path: "/tools/http-header-checker",
        sequence: 5,
        category: "HTTP & Network",
        shortDesc: "Inspect HTTP response headers, security headers (HSTS, CSP), and caching policies.",
        longDesc: "Inspect response headers from any web URL or paste raw HTTP headers. Analyze security postures like Content-Security-Policy, HSTS, X-Frame-Options, cache policies, and status codes.",
        h1: "HTTP Header Checker & Security Analyzer",
        seoTitle: "HTTP Header Checker – Inspect Response Headers, HSTS & CSP Online",
        metaDescription: "Analyze HTTP response headers, status codes, server information, and security headers like HSTS and CSP for any URL or raw header text.",
        keywords: ["http header checker", "check response headers", "security headers tester", "hsts checker", "content security policy audit"],
        isAvailable: true,
        iconName: "ShieldCheck",
        features: [
            "Comprehensive Security Headers Audit (HSTS, CSP, X-Frame-Options, Referrer-Policy)",
            "Categorized header breakdown: Security, Caching & CDN, Server Architecture, Encoding",
            "HTTP Status Code badges & standard RFC explanations",
            "One-click domain presets (Google, GitHub, Cloudflare, Nginx)",
            "Copy formatted headers and JSON export"
        ],
        howToSteps: [
            {
                title: "1. Enter URL or Paste Headers",
                desc: "Type a website domain URL or paste raw HTTP response headers directly."
            },
            {
                title: "2. Inspect Status & Scores",
                desc: "Check the status code badge and overall security headers score."
            },
            {
                title: "3. Review Security Directives",
                desc: "Verify critical headers like Strict-Transport-Security and Content-Security-Policy."
            },
            {
                title: "4. Export or Share",
                desc: "Copy the security report or raw headers list for team remediation."
            }
        ],
        faqs: [
            {
                question: "Why are security headers important?",
                answer: "Security headers like CSP, HSTS, and X-Frame-Options protect your website against Cross-Site Scripting (XSS), Clickjacking, and protocol downgrade attacks."
            },
            {
                question: "What is HSTS (Strict-Transport-Security)?",
                answer: "HSTS instructs browsers to always connect to your domain using secure HTTPS, preventing SSL-stripping and man-in-the-middle attacks."
            }
        ],
        relatedSlugs: ["user-agent-parser", "ip-lookup", "api-tester", "url-encoder"]
    },
    {
        id: "user-agent-parser",
        name: "User-Agent Parser",
        slug: "user-agent-parser",
        path: "/tools/user-agent-parser",
        sequence: 5,
        category: "HTTP & Network",
        shortDesc: "Parse and extract Browser, OS, Device, Engine, and Bot details from User-Agent strings.",
        longDesc: "Analyze User-Agent strings to identify browser versions, operating systems, hardware device types, rendering engines, and crawler bots with live auto-detection.",
        h1: "User-Agent Parser & Device Detector",
        seoTitle: "User-Agent Parser – Detect Browser, OS, Device & Search Bot Online",
        metaDescription: "Parse User-Agent strings to extract browser name, version, operating system, rendering engine, device type, and crawler bot identity online.",
        keywords: ["user agent parser", "parse user agent", "browser detector online", "user agent string tester", "detect googlebot ua"],
        isAvailable: true,
        iconName: "Cpu",
        features: [
            "Auto-detect current browser User-Agent with 1 click",
            "Detailed OS & architecture breakdown (Windows 11, macOS, iOS 18, Android 15)",
            "Device categorization (Desktop, Mobile, Tablet, Smart TV, Bot)",
            "Rendering Engine detection (Blink, WebKit, Gecko)",
            "Crawler and AI Bot identifier (Googlebot, Bingbot, Twitterbot, GPTBot)",
            "Pre-loaded User-Agent library presets"
        ],
        howToSteps: [
            {
                title: "1. Auto-Detect or Paste UA",
                desc: "Click 'Use My User-Agent' or paste any client User-Agent string."
            },
            {
                title: "2. Inspect Device Attributes",
                desc: "View parsed cards for Browser, Operating System, Device Type, and Layout Engine."
            },
            {
                title: "3. Check Bot Flags",
                desc: "Verify whether the string belongs to a human browser or search engine crawler."
            },
            {
                title: "4. Export JSON",
                desc: "Copy the structured JSON breakdown for analytics logging or server logic."
            }
        ],
        faqs: [
            {
                question: "What information is contained in a User-Agent header?",
                answer: "A User-Agent header contains client application details including browser name, browser version, underlying OS platform, rendering engine, and device type."
            },
            {
                question: "Can User-Agent strings be spoofed?",
                answer: "Yes. User-Agents are sent as plain HTTP request headers, meaning clients or bots can easily customize or spoof their UA string."
            }
        ],
        relatedSlugs: ["http-header-checker", "ip-lookup", "api-tester", "base64-encoder"]
    },
    {
        id: "ip-lookup",
        name: "IP & DNS Lookup",
        slug: "ip-lookup",
        path: "/tools/ip-lookup",
        sequence: 5,
        category: "HTTP & Network",
        shortDesc: "Look up IP addresses, geolocation, ISP data, and domain DNS records (A, MX, TXT).",
        longDesc: "Comprehensive IP and DNS lookup tool. Find geolocation, ASN info, and DNS records (A, AAAA, MX, NS, TXT) for any host or IP with real-time resolution.",
        h1: "IP & DNS Lookup Tool",
        seoTitle: "IP & DNS Lookup – Check Geolocation, ASN & Domain DNS Records Online",
        metaDescription: "Perform IP lookup and DNS queries. Check IP location, ISP, ASN, and view domain DNS records like A, AAAA, MX, and TXT.",
        keywords: ["ip lookup", "dns lookup", "check dns records", "ip geolocation tool", "whois ip lookup", "domain dns checker"],
        isAvailable: true,
        iconName: "Globe",
        features: [
            "Public IP Geolocation: Country, City, Region, Coordinates, Timezone",
            "Network & ISP info: Autonomous System Number (ASN), ISP Organization, Hostname",
            "DNS Record Inspector: A (IPv4), AAAA (IPv6), MX (Mail), TXT, NS records",
            "Domain presets (google.com, github.com, cloudflare.com)",
            "Formatted JSON output and one-click copy"
        ],
        howToSteps: [
            {
                title: "1. Enter Domain or IP",
                desc: "Type an IP address (e.g. 8.8.8.8) or domain hostname (e.g. github.com)."
            },
            {
                title: "2. Query DNS & Network",
                desc: "Click 'Inspect IP / Domain' to resolve addresses and geolocation."
            },
            {
                title: "3. Inspect DNS Records",
                desc: "Switch between Geolocation, ISP Network, and DNS Record tabs."
            },
            {
                title: "4. Copy Records",
                desc: "Copy DNS values or export the full network dossier in JSON format."
            }
        ],
        faqs: [
            {
                question: "What is an ASN (Autonomous System Number)?",
                answer: "An ASN is a globally unique identifier assigned to large network routing domains (such as Cloudflare AS13335 or Google AS15169) that control IP prefixes on the global internet."
            },
            {
                question: "What is the difference between A and MX DNS records?",
                answer: "'A' records map domain names to IPv4 addresses for web hosting, while 'MX' (Mail Exchange) records specify the mail servers responsible for handling email."
            }
        ],
        relatedSlugs: ["http-header-checker", "api-tester", "user-agent-parser", "robots-txt-generator"]
    },
    {
        id: "api-response-formatter",
        name: "API Response Formatter",
        slug: "api-response-formatter",
        path: "/tools/api-response-formatter",
        sequence: 5,
        category: "HTTP & Network",
        shortDesc: "Prettify, highlight, and convert raw API response data (JSON, XML, HTML, Headers).",
        longDesc: "Format and inspect messy API responses. Beautify JSON, explore interactive collapsible trees, copy JSONPath syntax (data.users[0].name), and inspect response size and latency metrics.",
        h1: "API Response Formatter & Viewer",
        seoTitle: "API Response Formatter – Beautify, Tree Inspect & Search API Payloads Online",
        metaDescription: "Format raw API responses into pretty JSON or XML. Syntax highlighted, searchable tree view, with one-click JSONPath copy and export.",
        keywords: ["api response formatter", "format json response", "api tree viewer", "jsonpath extractor", "beautify rest response"],
        isAvailable: true,
        iconName: "Terminal",
        features: [
            "Beautify, Minify, and Validate JSON/REST/GraphQL/GeoJSON responses",
            "Interactive Tree Inspector with collapsible nested nodes and type badges",
            "JSONPath node path copy (e.g. data.orders[0].items[1].sku)",
            "Payload size ($KB$) and response latency simulation",
            "Pre-loaded API response presets (E-commerce Order, GitHub User, GeoJSON, Stripe Webhook)",
            "Copy clean JSON and download .json file"
        ],
        howToSteps: [
            {
                title: "1. Paste API Response",
                desc: "Paste raw API response body from Postman, cURL, or fetch requests."
            },
            {
                title: "2. Beautify & Inspect Tree",
                desc: "Explore nested keys and objects in the interactive tree view."
            },
            {
                title: "3. Copy JSONPath",
                desc: "Click any property key to copy its exact JSONPath expression."
            },
            {
                title: "4. Download or Export",
                desc: "Export formatted JSON or minified payload with 1 click."
            }
        ],
        faqs: [
            {
                question: "Can I inspect large multi-megabyte API responses?",
                answer: "Yes! The formatter is optimized with virtualized DOM trees, allowing smooth inspection of complex payloads without freezing your browser."
            },
            {
                question: "What is JSONPath?",
                answer: "JSONPath is a query expression language (similar to XPath for XML) used to select and pinpoint specific elements within a JSON structure."
            }
        ],
        relatedSlugs: ["json-formatter", "api-tester", "webhook-tester", "json-to-csv"]
    }
];

export function getToolBySlug(slug: string): ToolItem | undefined {
    return TOOLS_CATALOG.find((t) => t.slug === slug);
}

export function getRelatedTools(slugs: string[]): ToolItem[] {
    return TOOLS_CATALOG.filter((t) => slugs.includes(t.slug));
}
