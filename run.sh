

#!/bin/bash

# Get script directory safely
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)

echo "Project root: $script_dir"

# Verify frontend
if [ ! -f "$script_dir/package.json" ]; then
    echo "ERROR: Frontend package.json not found"
    exit 1
fi

if ! grep -q '"dev"' "$script_dir/package.json"; then
    echo "ERROR: Frontend 'dev' script missing"
    npm run --prefix "$script_dir"
    exit 1
fi

# Verify backend
if [ ! -f "$script_dir/backend/package.json" ]; then
    echo "ERROR: Backend package.json not found"
    exit 1
fi

if ! grep -q '"dev"' "$script_dir/backend/package.json"; then
    echo "ERROR: Backend 'dev' script missing"
    npm run --prefix "$script_dir/backend"
    exit 1
fi

# Create frontend launcher
frontend_script=$(mktemp)
cat <<EOF > "$frontend_script"
#!/bin/bash
cd "$script_dir"
echo -e "\033[34m[FRONTEND]\033[0m Starting at \$(pwd)"
npm run dev
read -n 1 -s -p "Press any key to close..."
EOF
chmod +x "$frontend_script"

# Create backend launcher
backend_script=$(mktemp)
cat <<EOF > "$backend_script"
#!/bin/bash
cd "$script_dir/backend"
echo -e "\033[34m[BACKEND]\033[0m Starting at \$(pwd)"
npm run dev
read -n 1 -s -p "Press any key to close..."
EOF
chmod +x "$backend_script"

# Launch in separate Terminal windows
open -n -a Terminal "$frontend_script"
open -n -a Terminal "$backend_script"

# Cleanup after delay
(sleep 10; rm -f "$frontend_script" "$backend_script") &
