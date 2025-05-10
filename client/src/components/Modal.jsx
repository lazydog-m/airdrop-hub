import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grow from '@mui/material/Grow';
import { X } from 'lucide-react';
import { ButtonIcon } from './Button';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow timeout={5000} ref={ref} {...props} />;
});

Modal.propTypes = {
  // isOpen: PropTypes.bool,
  // title: PropTypes.node,
  // onFinish: PropTypes.func,
  // onClose: PropTypes.func,
  // children: PropTypes.node,
  // footerClose: PropTypes.bool,
}

export default function Modal({
  isOpen, onClose, size = 'md', title, content, minH, ...other }) {

  return (
    <Dialog
      // scroll='body'
      // {...other}
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth={size}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
      PaperProps={{
        style: {
          borderRadius: 8,
          border: '2px solid #1A1A1C',
          backgroundColor: '#09090B',
        }
      }}
    >
      <DialogTitle
        className='d-flex justify-content-between align-items-center color-white font-inter'
        sx={{
          letterSpacing: 'normal',
          fontSize: 18
        }}
      >
        <span>
          {title}
        </span>
        <ButtonIcon
          onClick={onClose}
          variant='ghost'
          icon={<X />}
        />
      </DialogTitle>
      <DialogContent className='color-white' sx={{
        minHeight: minH,
      }}>
        {content}
      </DialogContent>
    </Dialog>
  )

}
