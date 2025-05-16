#!/bin/bash

# Get the canonical absolute path (resolves symlinks and normalizes slashes)
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)

# Debug: Show the resolved path
echo "Running from: $script_dir"

# Verify package.json exists
if [ ! -f "$script_dir/package.json" ]; then
    echo "ERROR: package.json not found in $script_dir"
    exit 1
fi

# Verify dev script exists
if ! grep -q '"dev"' "$script_dir/package.json"; then
    echo "ERROR: 'dev' script not found in package.json"
    echo "Available scripts:"
    npm run
    exit 1
fi

# Frontend
osascript <<END
tell application "Terminal"
    activate
    do script "cd '$script_dir' && npm run dev"
end tell
END

# Backend (only if file exists)
if [ -f "$script_dir/run_backend.sh" ]; then
    osascript <<END
tell application "Terminal"
    activate
    do script "cd '$script_dir' && cd backend && npm run dev"
end tell
END
else
    echo "Note: run_backend.sh not found - skipping backend startup"
fi
