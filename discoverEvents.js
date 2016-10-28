const babylon = require('babylon');
const babel = require('babel-core');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const t = require('babel-types');
const SUPPORTED_EVENTS = require('./supportedEvents');
const chalk = require('chalk');
const enzyme = require('enzyme');
const sinon = require('sinon');
const React = require('react');
const vm = require('vm');

/**
 * We need to find the id of this element, or create one
 * for internal use.
 */
const getJSXElementId = (path, events) => {
  // Check if it already has an id
  const idIdentifier = path.parent.attributes
                        .find( attr => attr.name.name === 'id');
  let uniqueId;

  if (idIdentifier) {
    uniqueId = idIdentifier.value.value;
  } else {
    // Create a unique ID so we can keep track of it
    uniqueId = `__event_listener_${events.length}`;
    const idAttr = t.JSXAttribute(
      t.JSXIdentifier('id'),
      t.stringLiteral( uniqueId ),
    );
    path.insertBefore(idAttr);
  }

  return uniqueId;
}

/**
 * JSXAttribute Visitor
 *
 * If this is an event handler we want to keep track of it
 */
const JSXAttribute = (events, path) => {
  // We only care about event-listeners
  if ( SUPPORTED_EVENTS.includes(path.node.name.name) ) {
    const id = getJSXElementId(path, events);

    // Now we push to our list of events
    events.push({
      name: path.node.name.name,
      id,
    });
  }
};

/**
 * VariableDeclarator Visitor
 *
 * We use this to find the props passed to the component.
 */
const VariableDeclarator = (props, componentName, path) => {
  // Our component will be at the File scope level
  if ( path.scope.parentBlock.type === 'File' ) {
    const params = path.node.init.params[0].properties;
    params.forEach( param => {
      props.push(param.key.name);
    });
  }
};

/**
 * Find all of the events used in a JSX Component
 */
const discoverEvents = (src) => {
  const ast = babylon.parse(src, { sourceType: 'module', plugins: ['jsx'] } );
  const events = [];
  const props = [];
  let componentName = '';

  traverse(ast, {
    JSXAttribute: JSXAttribute.bind(this, events),
    VariableDeclarator: VariableDeclarator.bind(this, props, componentName),
  });

  return {
    events,
    props,
    code: generate(ast).code,
  };
};

/**
 * Evaluate how the component reacts to an event
 */
const evaluateResponseToEvent = (event, props, code) => {
  console.log(chalk.yellow('Evaluating component response to', event.name));

  // Setup all props as spies so we can see if they are executed
  const spies = {};
  props.forEach( prop => {
    spies[prop] = sinon.spy();
  });

  // We need to evaluate in order to 'import' the component;
  const transformedCode = babel.transform(code, { presets: ['react', 'es2015']}).code;
  const component = eval(transformedCode);

  // Render the component
  const wrapper = enzyme.shallow(
    React.createElement(
      component,
      spies,
      null,
    )
  );

  // Simulate the event
  wrapper.find(`#${event.id}`).simulate( event.name.substr(2) );

  // Check to see if any of the spies were called
  const called = [];
  Object.keys(spies).forEach( spy => {
    if (spies[spy].called) {
      called.push(spy);
    }
  });

  if (called.length > 0) {
    console.log(chalk.yellow('\tThe following props were called:'));
    console.log(chalk.yellow(`\t${called}`));
  } else {
    console.log(chalk.yellow('No props were called in response the event.'));
  }
};

/**
 * Processes the stateless component to discover how it
 * reacts to events in the DOM.
 */
const processEvents = (src) => {
  const { events, code, props } = discoverEvents(src);

  // List props
  if (props.length > 0) {
    console.log(chalk.blue('Found these props:'));
    props.forEach( prop => console.log(chalk.blue(' - ', prop) ) );
  }
  console.log();

  // List events
  if (events.length > 0) {
    console.log(chalk.blue('This component responds to these DOM events:'));
    events.forEach( event => console.log(chalk.blue(' - ', event.name) ) );
    console.log();

    events.forEach( event => evaluateResponseToEvent(event, props, code) );
  } else {
    console.log(chalk.yellow('This component does not respond to any DOM events.'));
  }
};

module.exports = processEvents;

