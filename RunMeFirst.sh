#!/bin/bash

# Get the canonical absolute path (resolves symlinks and normalizes slashes)
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)

# Debug: Show the resolved path
echo "Running from: $script_dir"

osascript <<END
tell application "Terminal"
    activate
    do script "cd '$script_dir' && npm i"
end tell
END
