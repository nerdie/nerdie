# Installation

First, get a copy of this project.  You probably want to fork http://github.com/nerdie/nerdie and then clone that.

In your directory, run:
    npm install .

Copy the config file config.json.default to config.json and edit as appropriate.

Now run:
    node server.js

## Tiny Module Errors

If you see this: 
"You're seeing this error because you used npm to install tiny.
Tiny has been renamed in the npm registry to "tiny" instead of "node-tiny".
Please use `npm install tiny` to update your package."

Then go to the node_modules directory and delete the node_tiny directory.  Back in the root directory, do:
    npm install tiny

Then edit nerdie_interface.js changing node_tiny into tiny as well.


# Usage
There are no usage instructions.  The following regular expressions are registered with nerdie by default:
    Registered pattern: /what is best in life/i
    Registered pattern: /(strong.+steel)|(steel.+strong)|(steel.+strength)|(strength.+steel)/i
    Registered pattern: /^(!|nerdita[:,]?\s)help$/
    Registered pattern: /^(?:is)?\s+any(?:one|body)\s+(?:here|around|awake)/i
    Registered pattern: /^(good)?\s?morning?/i
    Registered pattern: /^\:?wq?$/i
    Registered pattern: /^(!|nerdita[:,]?\s)count$/
    Registered pattern: /^(!|nerdita[:,]?\s)uniqueid$/
    Registered pattern: .
    Registered pattern: /^(!|nerdita[:,]?\s)tell\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)ask\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)reload\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)g(?:oogle)?\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)js\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)eval\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)convert\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)beerscore\s*(.+)$/
    Registered pattern: /^(!|nerdita[:,]?\s)twitter\s*(.+)$/
    Registered pattern: /https?:\/\/twitter.com\/(#!\/)?(.+?)\/status\/([0-9]+)/i
    Registered pattern: /^(!|nerdita[:,]?\s)weather\s*(.+)$/
    Registered pattern: /.*(?:terry\s+chay|tychay)/i
