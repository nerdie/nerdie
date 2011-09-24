# Installation

First, get a copy of this project.  You probably want to fork http://github.com/nerdie/nerdie and then clone that.

Next, make sure you have [node](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

In your directory, run:

    npm install .

Copy the config file `config.json.default` to `config.json` and edit as appropriate. It's in `.gitignore`, so your sensitive information won't be committed.

Now run:

    node server.js

# Usage

There are no usage instructions. For a nerdie bot named `nerdie` using the default prefix `!`, the following regular expressions are registered with nerdie by default:

    Registered pattern: /what is best in life/i
    Registered pattern: /(strong.+steel)|(steel.+strong)|(steel.+strength)|(strength.+steel)/i
    Registered pattern: /^(!|nerdie[:,]?\s)help$/
    Registered pattern: /^(?:is)?\s+any(?:one|body)\s+(?:here|around|awake)/i
    Registered pattern: /^(good)?\s?morning?/i
    Registered pattern: /^\:?wq?$/i
    Registered pattern: /^(!|nerdie[:,]?\s)count$/
    Registered pattern: /^(!|nerdie[:,]?\s)uniqueid$/
    Registered pattern: .
    Registered pattern: /^(!|nerdie[:,]?\s)tell\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)ask\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)reload\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)g(?:oogle)?\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)js\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)eval\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)convert\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)beerscore\s*(.+)$/
    Registered pattern: /^(!|nerdie[:,]?\s)twitter\s*(.+)$/
    Registered pattern: /https?:\/\/twitter.com\/(#!\/)?(.+?)\/status\/([0-9]+)/i
    Registered pattern: /^(!|nerdie[:,]?\s)weather\s*(.+)$/
    Registered pattern: /.*(?:terry\s+chay|tychay)/i
