# Editing the website without code

Open https://arthurcallewaert.com/admin/ and select **Open editor**.

1. Sign in at https://app.pagescms.org/ with the GitHub account authorized for this repository.
2. On first setup, install the Pages CMS GitHub App for **only `my-cv`**. Review its actual permission prompt before approving. This is separate from the Cloudflare integration.
3. Open `ArthurCallewaert03/my-cv`, select `main`, and choose **Edit my website**.
4. Edit the forms: introduction, main links, downloads, projects, about, conversation starters, contact, or extra sections.
5. Add/remove/reorder list entries. Use **Show** switches to hide an item without deleting it. Optional links may be left empty.
6. Save. Changes on `main` are public and trigger the existing Cloudflare deployment. Check the deployment and your website afterward.

## Images, files and QR codes

- Upload raster images (PNG, JPEG, WebP) through the image selector and PDF/VCF files through the document selector.
- Choose the replacement CV in the CV document field. Uploading a file alone does not select it.
- Changing the public email does not rewrite the downloadable VCF contact card; upload an updated VCF as well.
- Existing QR images are static. Replacing a PDF does not regenerate its QR image. Verify the QR destination and upload a replacement when needed.
- Links must use `https://` or `mailto:`. File paths are relative to the repository; don't add a leading slash.
- Repository files and uploaded media are public. Don't upload private documents or secrets.

## Security model

The public site has no write API, shared admin password, OAuth secret, or GitHub token. `/admin/` is a public sign-in shortcut, not an access-control boundary. Actual editing is handled by Pages CMS and GitHub authentication/repository permissions. Use MFA for GitHub and restrict the CMS app installation to this repository. CMS access grants are repository-level; the form schema is not an authorization sandbox against someone who already has repository write access.

Content is rendered as text, never as HTML. External links are restricted to HTTPS and mailto; media paths are confined to the site and allowed file extensions. Cloudflare `_headers` restrict scripts/styles/connections to this origin, block framing and plugins, and disable unused camera/microphone/location permissions. GitHub Pages does not process `_headers`; DOM rendering restrictions still apply there.

Pages CMS is a third-party service. Review its current permissions and account security before authorizing it. This setup reduces public-site attack surface; it is not a guarantee against account compromise or every vulnerability.

## Technical handoff

- `content/site.json`: editable public content.
- `.pages.yml`: Pages CMS form schema (JSON syntax, valid YAML).
- `assets/content.js`: dependency-free safe text renderer.
- `assets/site.css`: existing design, extracted from the original HTML.
- `assets/interactions.js`: dialogs, install prompt, and copy-email behavior.
- `admin/`: sign-in shortcut and editing instructions.
- `_headers`: Cloudflare response headers.

No hosting build-setting changes are required. Existing settings remain `exit 0`, output `.`. Relative paths work at both the custom domain and GitHub Pages `/my-cv/` base path.

The original HTML remains as a fallback if JavaScript is disabled or content loading fails. It is a snapshot, not automatically regenerated on content edits; non-JavaScript readers and crawlers may see that snapshot. For future server-rendered content/SEO requirements, add a tested build step on both hosting paths. Do not silently change only one host's build workflow.

Revert an incorrect content commit in GitHub to undo an edit. For a complete feature rollback, revert the integration commit. Media committed earlier is not removed merely because a link is hidden.

Official configuration guide: https://pagescms.org/docs/configuration/
