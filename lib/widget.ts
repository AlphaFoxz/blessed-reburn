/**
 * widget.js - high-level interface for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

const widget = {
  classes: [
    'Node',
    'Screen',
    'Element',
    'Box',
    'Text',
    'Line',
    'ScrollableBox',
    'ScrollableText',
    'BigText',
    'List',
    'Form',
    'Input',
    'Textarea',
    'Textbox',
    'Button',
    'ProgressBar',
    'FileManager',
    'Checkbox',
    'RadioSet',
    'RadioButton',
    'Prompt',
    'Question',
    'Message',
    'Loading',
    'Listbar',
    'Log',
    'Table',
    'ListTable',
    'Terminal',
    'Image',
    'ANSIImage',
    'OverlayImage',
    'Video',
    'Layout',
  ],
  aliases: {
    ListBar: 'Listbar',
    PNG: 'ANSIImage',
  },
};

// TODO
widget.classes.forEach(async function (name: string) {
  var file = name.toLowerCase();
  const module = await import(`./widgets/${file}.mjs`);
  widget[name] = widget[file] = module.default;
  widget[name] = widget[file] = require('./widgets/' + file);
});

Object.keys(widget.aliases).forEach(function (key) {
  var name = widget.aliases[key];
  widget[key] = widget[name];
  widget[key.toLowerCase()] = widget[name];
});

export default widget;
