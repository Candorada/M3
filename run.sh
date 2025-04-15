npm i

original_dir=$(pwd)

# First script in a new tab with a custom window title
osascript &>/dev/null <<EOF
tell application "Terminal"
    do script "cd \"$original_dir\" && ./run_frontend.sh"
    activate
end tell
EOF

# Second script in a new tab with a custom window title
osascript &>/dev/null <<EOF
tell application "Terminal"
    do script "cd \"$original_dir\" && ./run_backend.sh"
    activate
end tell
EOF

