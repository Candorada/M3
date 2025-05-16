
#!/bin/bash
clear
cd "$(dirname "$0")/frontend"  # Assumes frontend code is in a frontend/ subdirectory
npm install
npm run dev  # Or whichever script your frontend actually uses
