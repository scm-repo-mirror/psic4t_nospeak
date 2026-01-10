import { isAndroidCapacitorShell } from './platform';

interface OverscrollOptions {
    maxOverscroll?: number;    // Max pixels to allow overscroll (default: 80)
    resistance?: number;       // Dampening factor 0-1 (default: 0.4)
    bounceBack?: number;       // Bounce animation duration ms (default: 300)
}

/**
 * Svelte action that adds rubber-band overscroll effect on Android.
 * When user pulls past scroll boundaries, content moves with resistance
 * and bounces back on release.
 * 
 * @example
 * <div use:overscroll class="overflow-y-auto">...</div>
 */
export function overscroll(node: HTMLElement, options: OverscrollOptions = {}) {
    // Only enable on Android - iOS has native rubber-band, desktop doesn't need it
    if (!isAndroidCapacitorShell()) {
        return { destroy() {} };
    }

    const {
        maxOverscroll = 80,
        resistance = 0.4,
        bounceBack = 300
    } = options;

    let startY = 0;
    let currentOverscroll = 0;
    let isOverscrolling = false;
    let touchId: number | null = null;

    function isAtTop(): boolean {
        return node.scrollTop <= 0;
    }

    function isAtBottom(): boolean {
        return node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
    }

    function handleTouchStart(e: TouchEvent) {
        if (touchId !== null) return;
        const touch = e.touches[0];
        touchId = touch.identifier;
        startY = touch.clientY;
        currentOverscroll = 0;
        isOverscrolling = false;
        
        // Remove transition during active touch
        node.style.transition = '';
    }

    function handleTouchMove(e: TouchEvent) {
        if (touchId === null) return;
        
        const touch = Array.from(e.touches).find(t => t.identifier === touchId);
        if (!touch) return;

        const deltaY = touch.clientY - startY;
        
        // Check if we should start overscrolling
        if (!isOverscrolling) {
            if (deltaY > 0 && isAtTop()) {
                // Pulling down while at top
                isOverscrolling = true;
                startY = touch.clientY;
            } else if (deltaY < 0 && isAtBottom()) {
                // Pulling up while at bottom
                isOverscrolling = true;
                startY = touch.clientY;
            }
        }

        if (isOverscrolling) {
            const rawDelta = touch.clientY - startY;
            
            // Re-check boundaries - user might have scrolled back into content
            if ((rawDelta > 0 && !isAtTop()) || (rawDelta < 0 && !isAtBottom())) {
                // No longer at boundary, stop overscrolling
                isOverscrolling = false;
                node.style.transform = '';
                return;
            }
            
            // Apply resistance - diminishing returns as you pull further
            currentOverscroll = Math.sign(rawDelta) * 
                Math.min(Math.abs(rawDelta) * resistance, maxOverscroll);
            
            node.style.transform = `translateY(${currentOverscroll}px)`;
            
            // Prevent default scroll when actively overscrolling
            if (Math.abs(currentOverscroll) > 5) {
                e.preventDefault();
            }
        }
    }

    function handleTouchEnd(e: TouchEvent) {
        if (touchId === null) return;
        
        // Check if our touch ended
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (!touch) return;

        touchId = null;

        if (isOverscrolling && currentOverscroll !== 0) {
            // Animate back with easing
            node.style.transition = `transform ${bounceBack}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            node.style.transform = 'translateY(0)';
        }

        isOverscrolling = false;
        currentOverscroll = 0;
    }

    // Use passive: false on touchmove to allow preventDefault when overscrolling
    node.addEventListener('touchstart', handleTouchStart, { passive: true });
    node.addEventListener('touchmove', handleTouchMove, { passive: false });
    node.addEventListener('touchend', handleTouchEnd, { passive: true });
    node.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return {
        destroy() {
            node.removeEventListener('touchstart', handleTouchStart);
            node.removeEventListener('touchmove', handleTouchMove);
            node.removeEventListener('touchend', handleTouchEnd);
            node.removeEventListener('touchcancel', handleTouchEnd);
            node.style.transform = '';
            node.style.transition = '';
        }
    };
}
