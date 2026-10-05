import { site } from "@/config/site";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "Contact PicMagic",
  "Contact the PicMagic operator about feedback, content or privacy.",
  "/contact",
  Boolean(site.contact),
);
export default function Contact() {
  return (
    <article className="container prose">
      <h1>Let’s make PicMagic better.</h1>
      <p>Have an idea, a question, or a concern about a look in the library?</p>
      {site.contact ? (
        <>
          <h2>Get in touch</h2>
          {site.operator && <p>Operated by {site.operator}.</p>}
          <p>
            <a href={`mailto:${site.contact}`}>{site.contact}</a>
          </p>
          <p>
            Please include the page address for content-related requests. Avoid
            sending passwords or private photos.
          </p>
          <h2>Report an unreliable prompt</h2>
          <p>
            Use the issue report on the prompt page, or email its address, the
            tool and model you used, and the specific difference between the
            instructions and your result. Text descriptions are enough; do not
            attach personal reference photographs. We may need more information
            before reproducing an issue.
          </p>
        </>
      ) : (
        <p>
          The operator’s public contact details are being prepared for launch.
        </p>
      )}
      <h2>Follow PicMagic</h2>
      <p>
        Find photo ideas and prompt walkthroughs on our official social pages.
      </p>
      <ul>
        {site.social.map(({ label, href }) => (
          <li key={label}>
            <a href={href} rel="me">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
