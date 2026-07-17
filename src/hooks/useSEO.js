import { useEffect } from 'react'

const SITE_NAME = 'Reach The Launch'

function setMetaTag(attr, key, content) {
  if (!content) return
  let tag = document.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// Sets document title + meta description/keywords/OG tags per page.
// This runs client-side, which Google's crawler does execute — but it
// still matters for Bing/social-preview crawlers that don't run JS, so
// keep index.html's defaults reasonable as the fallback for those.
export function useSEO({ title, description, keywords, image }) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME

    if (description) {
      setMetaTag('name', 'description', description)
      setMetaTag('property', 'og:description', description)
    }
    if (keywords?.length) {
      setMetaTag('name', 'keywords', keywords.join(', '))
    }
    setMetaTag('property', 'og:title', title ? `${title} | ${SITE_NAME}` : SITE_NAME)
    setMetaTag('property', 'og:url', window.location.href)
    if (image) setMetaTag('property', 'og:image', image)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', window.location.href)
  }, [title, description, keywords, image])
}
