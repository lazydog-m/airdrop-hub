import useMessage from '@/hooks/useMessage';
import { message } from 'antd';
import { CheckSquare, CircleCheck } from 'lucide-react';
import PropTypes from 'prop-types';
import { createContext } from 'react';

const initialState = {
  onSuccess: () => { },
}

const MessageContext = createContext(initialState);

MessageProvider.propTypes = {
  children: PropTypes.node,
}

function MessageProvider({ children }) {

  const [messageApi, contextHolder] = message.useMessage();

  const success = (message) => {
    messageApi.open({
      type: 'success',
      content: message,
      // duration: 50000,
      icon: <CircleCheck size={'16px'} className='me-5' />
    });
  };
  return (
    <MessageContext.Provider
      value={{
        onSuccess: success,
      }}
    >
      {contextHolder}
      {children}
    </MessageContext.Provider>
  )
}

export { MessageProvider, MessageContext }
