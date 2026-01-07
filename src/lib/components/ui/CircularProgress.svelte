<script lang="ts">
    interface Props {
        size?: number;
        strokeWidth?: number;
        class?: string;
    }
    
    let { 
        size = 48, 
        strokeWidth = 4,
        class: className = ""
    }: Props = $props();
</script>

<div 
    class={`circular-progress ${className}`}
    style="width: {size}px; height: {size}px;"
    role="progressbar"
    aria-label="Loading"
>
    <svg viewBox="0 0 48 48">
        <circle 
            cx="24" 
            cy="24" 
            r={20} 
            fill="none" 
            stroke-width={strokeWidth} 
        />
    </svg>
</div>

<style>
    .circular-progress {
        display: inline-block;
        animation: rotate 2s linear infinite;
        color: var(--color-lavender, #7287fd);
    }

    svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    circle {
        stroke: currentColor;
        stroke-linecap: round;
        animation: dash 1.4s ease-in-out infinite;
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
        }
    }
</style>
