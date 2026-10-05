import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

/**
 * AdBanner Component
 * Modular slot for Google AdSense, Yandex Advertising Network (РСЯ), or direct partner banners.
 * Supports vertical (160x600 / 300x600) and horizontal (728x90 / 970x90 / fluid) formats.
 */
export default function AdBanner({
  slotId = 'ad-slot-default',
  format = 'vertical', // 'vertical' | 'horizontal' | 'compact'
  label = null,
  lang = 'ru',
  t = {},
  className = '',
}) {
  const adLabel = label || t.adSlotTitle || (lang === 'en' ? 'Advertisement' : 'Реклама');
  const adHint =
    format === 'horizontal'
      ? t.adSlotHorizontal || (lang === 'en' ? 'Ad Banner Slot (728×90 / 970×90)' : 'Рекламный блок (728×90 / 970×90)')
      : t.adSlotPlaceholder ||
        (lang === 'en' ? 'Google AdSense / YAN banner (160×600 / 300×600)' : 'Место для баннера Google AdSense / РСЯ');

  return (
    <aside
      id={slotId}
      className={`ad-slot-wrapper ad-format-${format} ${className}`}
      aria-label={adLabel}
    >
      <div className="ad-header-bar">
        <span className="ad-badge">
          <Sparkles size={11} />
          <span>{adLabel}</span>
        </span>
      </div>

      <div className="ad-content-box">
        {/* Placeholder for Google AdSense / Yandex RTB tags */}
        <div className="ad-placeholder-inner">
          <div className="ad-icon-circle">
            <ExternalLink size={20} />
          </div>
          <span className="ad-placeholder-title">
            {format === 'horizontal' ? '728 × 90 / Leaderboard' : '160×600 / 300×600'}
          </span>
          <p className="ad-placeholder-hint">{adHint}</p>
          <span className="ad-subhint">
            {lang === 'en' ? 'Ready for AdSense / YAN script' : 'Готово для кода РСЯ / AdSense'}
          </span>
        </div>

        {/* Real Ad container ready for injection:
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="XXXXXXXXXX"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        */}
      </div>
    </aside>
  );
}
