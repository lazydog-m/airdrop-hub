import PropTypes from 'prop-types';
import { PanelLeft } from 'lucide-react';
import useResponsive from '../../hooks/useResponsive';

CollapseButton.propTypes = {
  onToggleCollapse: PropTypes.func,
  isCollapse: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
}

export default function CollapseButton({ onToggleCollapse, onOpenSidebar, isCollapse }) {
  const { isMobile } = useResponsive();

  return (
    <div
      className="sidebar-toggle"
      style={{
        marginLeft: isMobile ? 0 : !isCollapse ? 240 : 58,
      }}
      onClick={isMobile ? onOpenSidebar : onToggleCollapse}
    >
      <PanelLeft className='collapse-icon' size={19} />
    </div>
  )
}
