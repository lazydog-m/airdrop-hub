import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';

export const HeaderAction = ({ heading, action }) => {

  return (
    <div className='d-flex justify-content-between'>
      <span className='fw-700 font-inter fs-23 color-white'>{heading}</span>
      {action}
    </div>
  )

}

export const HeaderBreadcrumbs = ({ heading, action, links, headingStyle, style, ...other }) => {

  return (
    <>
      <div className='heading-action d-flex justify-content-between' style={{ ...style }}>
        <span className='fw-bold fs-20' style={{ ...headingStyle }}>{heading}</span>
        {action}
      </div>
      <Breadcrumb
        className='mt-10'
        style={{ ...style }}
        items={links}
        {...other}
      />
    </>
  )

}

HeaderAction.propTypes = {
  heading: PropTypes.string,
  action: PropTypes.node,
  headingStyle: PropTypes.object,
  headingCustom: PropTypes.node,
  style: PropTypes.object,
}

HeaderBreadcrumbs.propTypes = {
  heading: PropTypes.string,
  action: PropTypes.node,
  links: PropTypes.array,
  style: PropTypes.object,
  headingStyle: PropTypes.object,
}

