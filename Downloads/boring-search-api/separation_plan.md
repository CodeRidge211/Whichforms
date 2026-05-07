# Project Separation Plan

The current issue with "merging" in Google Console is caused by two main factors:
1. **Shared Verification Files**: Your `public` folder contains verification files for *all* projects. Since `public` is the default fallback, Google sees these files on multiple domains.
2. **Global Backend Routes**: Your `server.js` has global routes that serve verification tokens regardless of which domain is being accessed.

To fix this and "separate the projects," we will restructure the codebase into a clean, multi-tenant directory or separate repositories.

## 1. Clean Directory Structure
We will move the sites into a `projects/` directory and keep the API logic separate.

```text
/boring-search-api
  /api-server          <-- Express backend only
  /projects
    /site-faultdeck    <-- FaultDeck frontend only
    /site-boringsearch <-- Boring Search frontend only
    /site-plaintools   <-- ThePlainTools frontend only
```

## 2. Fix the Server Logic
We will update `server.js` to:
- **Strictly handle verification**: Only serve a verification file if the request hostname matches the site.
- **Remove Global Overlaps**: Stop serving the same `public` folder for all domains.

## 3. Deployment Separation
To truly separate them in Google Console's eyes, you should ideally have **separate Railway projects** (or separate services within one project) for each domain. This ensures they have different IP footprints/headers and don't share the same "catch-all" behavior.

---

### Immediate Fixes (Stop the Merging)

1. **Delete** all verification files (`google*.html`, `*.txt`) from the root `public` folder.
2. **Move** each verification file ONLY to its specific site folder (`site-faultdeck`, `site-boringsearch`, etc.).
3. **Update `server.js`** to remove lines 35-38 and 126-129.

Would you like me to proceed with moving these files and cleaning up the server?
