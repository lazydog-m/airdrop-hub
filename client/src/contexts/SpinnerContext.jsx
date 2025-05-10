import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
// import { SpinnerCircularFixed } from 'spinners-react';

const initialState = {
  onOpen: () => { },
  onClose: () => { },
}

const SpinnerContext = createContext(initialState);

SpinnerProvider.propTypes = {
  children: PropTypes.node,
}

const rootStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 9999999999,
}

function SpinnerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <SpinnerContext.Provider
      value={{
        onOpen: handleOpen,
        onClose: handleClose,
      }}
    >
      {isOpen &&
        <div style={rootStyle} className='select-none loader-wrapper'>
          <span class="loader"></span>
        </div>
      }
      {children}
    </SpinnerContext.Provider>
  )
}

export { SpinnerProvider, SpinnerContext }
