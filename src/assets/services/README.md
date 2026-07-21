# Service artwork

Drop one image per service in this folder. The filename (without extension)
must match the `image` key in [`src/data/services.ts`](../../data/services.ts):

| File to add        | Service                       |
| ------------------ | ----------------------------- |
| `wordpress.*`      | WordPress Development         |
| `seo.*`            | SEO Optimization              |
| `front-end.*`      | Front-End Development         |
| `maintenance.*`    | Website Maintenance           |
| `google-ads.*`     | Google Ads & Digital Marketing |
| `social-media.*`   | Social Media Management       |

Accepted extensions: `.webp`, `.avif`, `.png`, `.jpg`, `.jpeg`.

Notes:

- **Cards work without these files.** Any service with no matching image falls
  back to the icon badge, so you can add them one at a time.
- Images are cropped to **16:10** and `object-cover`, so keep the subject
  centred and away from the edges.
- Supply roughly **800px wide or larger**. Astro generates the smaller sizes and
  converts formats at build time, so there is no need to pre-optimise.
- The `alt` is intentionally empty — the artwork is decorative and the service
  title next to it already names the card for screen readers.
