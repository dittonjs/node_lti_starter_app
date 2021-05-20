import React, {useRef, useEffect} from 'react';
import _ from 'lodash';
export default ({ contentItem }) => {
  const formEl = useRef(null);
  const { content_item_return_url: contentItemReturnUrl } = window.DEFAULT_SETTINGS;
  useEffect(() => {
    formEl.current.submit();
  }, [])

  return (
    <form ref={formEl} method="post" action={contentItemReturnUrl} encType="application/x-www-form-urlencoded">
      {
        _.map(contentItem, (key, value) => (
          <input hidden name={key} value={value} />
        ))
      }
    </form>
  )
}