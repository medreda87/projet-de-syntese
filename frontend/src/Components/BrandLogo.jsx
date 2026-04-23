import React from 'react';

const LOGO_SRC = '/images/imageLogo.png';

/**
 * BrandLogo — shared logo image + brand name component.
 *
 * Props:
 *   imgClassName      — className for the <img> element
 *   nameTag           — element type for the brand name (default: 'span')
 *   nameClassName     — className for the brand name element
 *   nameStyle         — inline style for the brand name element
 *   showSubtitle      — render "Dashboard" subtitle below the name (default: false)
 *   subtitleClassName — className for the subtitle <span>
 *
 * Renders a React Fragment so the parent controls layout (flex, grid, etc.)
 */
function BrandLogo({
  imgClassName,
  nameTag: Tag = 'span',
  nameClassName,
  nameStyle,
  showSubtitle = false,
  subtitleClassName,
}) {
  return (
    <>
      <img src={LOGO_SRC} alt="Mesbanati Logo" className={imgClassName} />
      {/* {showSubtitle && (
        <span className={subtitleClassName}>Dashboard</span>
      )} */}
    </>
  );
}

export default BrandLogo;
