

## --- You need these on your machine to run the CLI ---

1. Install *NVM* (preferred way to manage Node.js versions). 

2. Add a *.nvmrc* file to the root of your project directory that contains a snippet of text:
    22.15.0
    > This allows you to simply type `nvm use` in your CLI while in the root of your project to activate the correct version of node!
    > You may get an installation command to run if you don't yet have that version of node, but it's just another one-liner.

3. To make sure you've activated the correct version of node, type:
    ~/workspace/projectName$ `node --version`
    # Prints: v22.15.0

