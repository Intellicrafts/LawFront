# SEO Implementation Plan for Mera Vakil

## Goal
Improve organic search visibility, click-through rates (CTR), and user acquisition by optimizing technical SEO, content structure, and performance.

## 1. Technical SEO Configuration
### A. Dynamic Meta Tags (`react-helmet-async`)
-   **Problem**: Current app uses static meta tags in `public/index.html`. Single Page Applications (SPAs) need dynamic tags for each route to be properly indexed for specific keywords.
-   **Action**: 
    1.  Install `react-helmet-async`.
    2.  Create a reusable `SEO` component.
    3.  Implement unique Titles and Descriptions for:
        -   Home (`/`)
        -   Verify Lawyer (`/verify-lawyer`) - *Keywords: "Verify Lawyer India", "Bar Council Verification"*
        -   Find Lawyer (`/legal-consoltation`) - *Keywords: "Find Lawyer Online", "Legal Consultation"*
        -   Chatbot (`/chatbot`)

### B. Sitemap & Robots.txt
-   **Action**:
    -   Create `public/sitemap.xml` listing all public routes.
    -   Create `public/robots.txt` to guide crawlers (allow all, point to sitemap).

### C. Canonical URLs
-   Ensure each page points to its canonical self to avoid duplicate content punishment (especially with trailing slashes vs no-slash).

## 2. Structured Data (Schema.org)
-   **Why**: Helps Google understand the "Business" and "Product" nature of the site, enabling Rich Snippets (e.g., star ratings, search box).
-   **Implementation**:
    -   **Organization Schema**: Logo, Social Links, Contact Info.
    -   **WebSite Schema**: Sitelinks Search Box.
    -   **SoftwareApplication Schema**: For the AI Assistant and Wallet features.
    -   **Service Schema**: For "Lawyer Verification" and "Legal Consultation".
    -   Inject these as JSON-LD using the `SEO` component.

## 3. Keyword Strategy (Content)
-   **Target Keywords**:
    -   *Primary*: "AI Lawyer India", "Verify Advocate Enrollment", "Legal Advice Online".
    -   *Long-tail*: "Check lawyer license number UP", "Legal draft review AI".
-   **Action**: Update page content (H1, H2, p) on landing pages to naturally include these keywords.

## 4. Performance & UX (Core Web Vitals)
-   **LCP (Largest Contentful Paint)**: Optimize hero images (WebP format, specific dimensions).
-   **CLS (Cumulative Layout Shift)**: Ensure all images have `width` and `height` attributes.
-   **Mobile Friendliness**: Ensure touch targets are large enough (already good with current UI).

## 5. Local SEO (Future / Off-page)
-   *Suggestion*: Create Google My Business profile.
-   *Suggestion*: Get listed in local directories (JustDial, Sulekha) pointing to this domain.

## Execution Steps
1.  **Install Dependencies**: `npm install react-helmet-async`
2.  **Create SEO Component**: `src/components/common/SEO.jsx`
3.  **Integrate**: Wrap `App.jsx` in `HelmetProvider` and add `<SEO />` to all main pages.
4.  **Add Files**: Create `robots.txt` and `sitemap.xml`.
5.  **Review**: Verify tags change when navigating.
