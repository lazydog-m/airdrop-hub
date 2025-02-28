import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grow from '@mui/material/Grow';
import { Fade } from '@mui/material';

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
  isOpen, onClose, size = 'md', title, content, footer }) {

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Fade}
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
          // height: '500px'
          // position: 'absolute',
          // top: 0, // Đặt ở trên cùng
          // left: '50%', // Đặt ở giữa theo chiều ngang
          // transform: 'translateX(-50%)', // Căn giữa theo chiều ngang
          // margin: 0, // Loại bỏ margin
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
        <span>
          {"exit?"}
        </span>
      </DialogTitle>
      <DialogContent className='color-white'>
        {content}
      </DialogContent>
      <DialogActions className=''>
        {footer}
      </DialogActions>
    </Dialog>
  )

}
