import { HeaderClient } from './header-client'

/**
 * Header wrapper. Auth state is resolved client-side (see useUser) so the
 * header never calls cookies() during render — that keeps the rest of the
 * site statically renderable instead of forcing every route to be dynamic.
 */
export function Header() {
  return <HeaderClient />
}
