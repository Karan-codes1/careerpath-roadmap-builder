'use client'

import { useEffect, useRef } from 'react'

const GSI_SRC = 'https://accounts.google.com/gsi/client'

/**
 * Renders Google's official "Sign in with Google" button.
 * Google hands us an ID token (`response.credential`) which we pass straight
 * to the parent — the backend is what actually verifies it.
 */
export default function GoogleLoginButton({ onCredential, text = 'signin_with' }) {
  const buttonRef = useRef(null)

  // Kept in a ref so a new inline callback on every render doesn't
  // re-initialize the Google button.
  const onCredentialRef = useRef(onCredential)
  useEffect(() => {
    onCredentialRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => onCredentialRef.current(response.credential),
      })

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text,
      })
    }

    if (window.google?.accounts?.id) {
      renderButton()
      return
    }

    let script = document.querySelector(`script[src="${GSI_SRC}"]`)

    if (!script) {
      script = document.createElement('script')
      script.src = GSI_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    script.addEventListener('load', renderButton)
    return () => script.removeEventListener('load', renderButton)
  }, [text])

  // Not configured yet — render nothing rather than a broken button
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null

  return <div ref={buttonRef} className="flex justify-center" />
}
