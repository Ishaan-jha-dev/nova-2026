interface NovaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'icon'
  className?: string
}

export function NovaLogo({ size = 'md', className = '' }: NovaLogoProps) {
  const sizes = {
    sm: { 
      container: 'h-6 gap-1.5', 
      box: 'w-6 h-6 rounded-[6px] text-[10px]', 
      text: 'text-sm', 
      sub: 'text-[8px] tracking-[0.15em] ml-0.5' 
    },
    md: { 
      container: 'h-8 gap-2', 
      box: 'w-8 h-8 rounded-[8px] text-xs', 
      text: 'text-lg', 
      sub: 'text-[10px] tracking-[0.2em] ml-1' 
    },
    lg: { 
      container: 'h-12 gap-3', 
      box: 'w-12 h-12 rounded-xl text-lg', 
      text: 'text-2xl', 
      sub: 'text-sm tracking-[0.25em] ml-2' 
    },
    icon: { 
      container: 'h-8', 
      box: 'w-8 h-8 rounded-[8px] text-xs', 
      text: 'hidden', 
      sub: 'hidden' 
    }
  }

  const s = sizes[size] || sizes.md

  if (size === 'icon') {
    return (
      <div 
        className={`bg-[#A82828] flex items-center justify-center font-display font-black text-white border border-[#A82828]/20 shadow-[0_0_12px_rgba(168,40,40,0.3)] shrink-0 ${s.box} ${className}`}
        style={{ textShadow: '0 1px 1px rgba(0,0,0,0.2)' }}
      >
        NO
      </div>
    )
  }

  return (
    <div className={`flex items-center select-none ${s.container} ${className}`}>
      <div 
        className={`bg-[#A82828] flex items-center justify-center font-display font-black text-white border border-[#A82828]/20 shadow-[0_0_12px_rgba(168,40,40,0.3)] shrink-0 ${s.box}`}
        style={{ textShadow: '0 1px 1px rgba(0,0,0,0.2)' }}
      >
        NO
      </div>
      <span className={`font-display font-black text-white uppercase tracking-tight leading-none ${s.text}`}>
        VA&apos;26
      </span>
      <span className={`font-display font-black text-white/40 uppercase leading-none ${s.sub}`}>
        UNPLUGGED
      </span>
    </div>
  )
}
