import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../ui/input';
// antd
RHFInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  textarea: PropTypes.bool,
};

export default function RHFInput({ name, label, required, ...other }) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {label &&
            <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
              {label}
              <span className={required && 'required'}></span>
            </label>
          }
          <Input className='mt13' status={error && 'error'} {...field} {...other} />
          {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
        </>
      )}

    />
  )

  // if (textarea) {
  //   return (
  //     <Controller
  //       name={name}
  //       control={control}
  //       render={({ field, fieldState: { error } }) => (
  //         <>
  //           {label &&
  //             <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
  //               {label}
  //               <span className={required && 'required'}></span>
  //             </label>
  //           }
  //           <TextArea className='mt-13' status={error && 'error'} {...field} {...other} />
  //           {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
  //         </>
  //       )}
  //
  //     />
  //   )
  // }

}
