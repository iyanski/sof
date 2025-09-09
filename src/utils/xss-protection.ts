// XSS Protection utilities

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') {
    return ''
  }
  
  // Basic HTML sanitization - allow only safe tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br']
  const tagRegex = new RegExp(`<(?!/?(?:${allowedTags.join('|')})(?:\\s|>))[^>]*>`, 'gi')
  
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(tagRegex, '')
}

/**
 * Sanitize text content (removes all HTML)
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') {
    return ''
  }
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

/**
 * Escape HTML entities to prevent XSS
 */
export const escapeHTML = (text: string): string => {
  if (typeof text !== 'string') {
    return ''
  }
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  }
  
  return text.replace(/[&<>"'/]/g, (s) => map[s])
}

/**
 * Safe way to set innerHTML with XSS protection
 */
export const setSafeInnerHTML = (element: HTMLElement, content: string): void => {
  if (!element || typeof content !== 'string') {
    return
  }
  
  element.innerHTML = sanitizeHTML(content)
}

/**
 * Validate and sanitize URL to prevent javascript: and data: URLs
 */
export const sanitizeURL = (url: string): string | null => {
  if (typeof url !== 'string') {
    return null
  }
  
  const sanitized = url.trim()
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']
  const lowerUrl = sanitized.toLowerCase()
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return null
    }
  }
  
  // Only allow http, https, and relative URLs
  if (lowerUrl.startsWith('http://') || 
      lowerUrl.startsWith('https://') || 
      lowerUrl.startsWith('/') || 
      lowerUrl.startsWith('./') || 
      lowerUrl.startsWith('../') ||
      lowerUrl.startsWith('#')) {
    return sanitized
  }
  
  return null
}

/**
 * Sanitize form data to prevent injection attacks
 */
export const sanitizeFormData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value)
    } else if (typeof value === 'number') {
      // Validate numbers are finite and not NaN
      sanitized[key] = isFinite(value) ? value : 0
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeText(item) : item
      )
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeFormData(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}
