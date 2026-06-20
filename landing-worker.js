// Cloudflare Worker — serves the kamsite.uk landing page.
// Bare domain (kamsite.uk) works directly; no bucket, no /index.html needed..

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kamsite</title>
  <style>
    :root {
      --bg: #0e0e14;
      --fg: #ececf1;
      --muted: #9a97a8;
      --accent: #7c6cff;
      --accent-hover: #9385ff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      background: var(--bg);
      background-image: radial-gradient(circle at 50% -10%, #211c3d 0%, var(--bg) 55%);
      color: var(--fg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      min-height: 100dvh;
      text-align: center;
      padding: 1.5rem;
    }
    main { max-width: 34rem; width: 100%; }
    h1 {
      font-size: clamp(2.5rem, 9vw, 4rem);
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
    }
    .tagline {
      color: var(--muted);
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }
    .play-button {
      display: inline-block;
      background: var(--accent);
      color: #fff;
      font-size: 1.15rem;
      font-weight: 600;
      text-decoration: none;
      padding: 1rem 3rem;
      border-radius: 0.75rem;
      transition: transform 0.15s ease, background 0.15s ease;
      box-shadow: 0 8px 30px rgba(124, 108, 255, 0.35);
    }
    .play-button:hover { background: var(--accent-hover); transform: translateY(-2px); }
    .play-button:active { transform: translateY(0); }
    .links {
      margin-top: 3rem;
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .links a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.15s ease;
    }
    .links a:hover { color: var(--fg); }
    .hint {
      margin-top: 2rem;
      color: var(--muted);
      font-size: 0.85rem;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <main>
    <h1>Kamsite</h1>
    <p class="tagline">A little something I'm building. Jump in and play.</p>

    <a class="play-button" href="https://play.kamsite.uk/index.html">▶ Kamsimulator</a>

    <p class="hint">
      Viva um dia como K.S
    </p>
  </main>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(PAGE, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=300",
      },
    });
  },
};
