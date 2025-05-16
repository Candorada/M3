#!/bin/bash

# ---- Installation Functions ----
install_homebrew() {
    echo -e "\033[34m\nInstalling Homebrew...\033[0m"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Configure Homebrew in current shell
    if [ -f "/opt/homebrew/bin/brew" ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"  # Apple Silicon
    elif [ -f "/usr/local/bin/brew" ]; then
        eval "$(/usr/local/bin/brew shellenv)"     # Intel Mac
    fi
    echo -e "\033[32m✓ Homebrew installed\033[0m"
}

install_node_with_brew() {
    echo -e "\033[34m\nInstalling Node.js via Homebrew...\033[0m"
    brew install node
    echo -e "\033[32m✓ Node.js installed\033[0m"
}

install_dependencies() {
    echo -e "\033[34m\nInstalling project dependencies...\033[0m"
    npm install
    echo -e "\033[32m✓ Dependencies installed\033[0m"
}

# ---- Main Execution ----
echo -e "\n\033[36m=== Development Environment Setup ===\033[0m"

# 1. Check/Install Homebrew first
if ! command -v brew &>/dev/null; then
    echo -e "\033[33mHomebrew not found\033[0m"
    read -p "Install Homebrew (required for Node.js installation)? [Y/n] " response
    if [[ "${response:-Y}" =~ ^[Yy] ]]; then
        install_homebrew
    else
        echo -e "\033[31mHomebrew is required for automated Node.js installation\033[0m"
        echo "You can manually install Node.js from https://nodejs.org"
        exit 1
    fi
else
    echo -e "\033[32m✓ Homebrew already installed\033[0m"
fi

# 2. Check/Install Node.js (using Homebrew)
if ! command -v npm &>/dev/null; then
    echo -e "\033[33mNode.js not found\033[0m"
    install_node_with_brew
else
    echo -e "\033[32m✓ Node.js already installed ($(node --version))\033[0m"
fi

# 3. Install project dependencies (if package.json exists)
if [ -f "package.json" ]; then
    install_dependencies
else
    echo -e "\033[33m\nWarning: No package.json found in $(pwd)\033[0m"
fi

echo -e "\n\033[36mSetup complete! You can now run the development servers.\033[0m"
