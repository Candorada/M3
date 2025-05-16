#!/bin/bash

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)

# Request permission first
osascript <<EOF
display dialog "This script needs to open Terminal. Allow it?" \
buttons {"Cancel", "OK"} \
default button "OK" \
with icon caution

tell application "Terminal"
    activate
    do script "cd $(printf '%q' "$script_dir") && npm i"
end tell
EOF
