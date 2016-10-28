// List of supported events https://facebook.github.io/react/docs/events.html
// Can also be appended with Capture
module.exports = (() => {
  const MOUSE_EVENTS = ['onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit',
'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave',
'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp'];

  const INPUT_EVENTS = ['onChange', 'onInput', 'onSubmit'];
  const FOCUS_EVENTS = ['onFocus', 'onBlur'];

  const events = [];

  MOUSE_EVENTS.forEach( event => events.push(event) );
  INPUT_EVENTS.forEach( event => events.push(event) );
  FOCUS_EVENTS.forEach( event => events.push(event) );

  return events;
})();
