import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import ContentItemSelectionForm from './lti/content_item_selection_form';

const App = () => {

  const [contentItem, setContentItem] = useState(null);
  const { content_item_return_url: contentItemReturnUrl } = window.DEFAULT_SETTINGS;
  const handleTest = () => {
    fetch('/api/lti_launches', {
      method: 'POST',
      body: JSON.stringify({
        config: {
          testValue: "I am a test!",
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${window.DEFAULT_JWT}`
      }
    }).then(res => res.json())
    .then(setContentItem);
  }
  console.log(contentItem);

  if (contentItem) {
    return <ContentItemSelectionForm contentItem={contentItem} />
  }
  return (
    <div>
      <img id="usu-logo" src="/vertical_logo_blue.png" />
      <h1>Welcome to the LTI Starter App</h1>
      {contentItemReturnUrl && <button onClick={handleTest}>TEST</button>}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));