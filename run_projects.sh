#!/bin/bash

# --- Dynamic Project Path Configuration ---
# This script automatically determines the project paths based on its own location.
# It assumes the following directory structure:
# /your-main-project-folder
# |-- run_projects.sh  (this script)
# |-- pos-backend/     (your Django project)
# |-- POS/             (your Next.js project)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
DJANGO_PROJECT_PATH="$SCRIPT_DIR/pos-backend"
NEXTJS_PROJECT_PATH="$SCRIPT_DIR/POS"

# --- Static Configuration ---
# Path to your Django project's Python virtual environment activation script
DJANGO_VENV_PATH="$DJANGO_PROJECT_PATH/venv/bin/activate"


# ------------------- Helper Functions -------------------

# Function to check if tmux is installed
check_tmux() {
    if ! command -v tmux &> /dev/null; then
        echo "Error: tmux is not installed. This is required to run both projects simultaneously."
        echo "Please install it by running: sudo apt update && sudo apt install tmux"
        exit 1
    fi
}

# ------------------- Main Script Logic -------------------

echo "========================================"
echo "      Project Development Launcher      "
echo "========================================"
echo
echo "Which project would you like to run?"
echo "  1) Django"
echo "  2) Next.js"
echo "  3) Both Django and Next.js (in a split terminal)"
echo "  4) Exit"
echo

# Loop until a valid choice is made
while true; do
    read -p "Enter your choice [1-4]: " choice
    case $choice in
        1)
            # Run Django directly in the current terminal
            echo "Starting the Django project..."
            cd "$DJANGO_PROJECT_PATH"
            source "$DJANGO_VENV_PATH"
            python manage.py migrate
            python manage.py runserver
            break
            ;;
        2)
            # Run Next.js directly in the current terminal
            echo "Starting the Next.js project..."
            cd "$NEXTJS_PROJECT_PATH"
            npm install
            npm run dev
            break
            ;;
        3)
         # Check for tmux before proceeding
            check_tmux
            
            # Check if a tmux session named "projects" already exists and kill it
            if tmux has-session -t "projects" 2>/dev/null; then
                echo "A session named 'projects' is already running. Killing it to start fresh..."
                tmux kill-session -t "projects"
            fi
            
            echo "Starting both projects in a new tmux session..."

            # Define commands for each pane
            django_commands="cd '$DJANGO_PROJECT_PATH' && source '$DJANGO_VENV_PATH' && python manage.py migrate && python manage.py runserver && exec bash"
            nextjs_commands="cd '$NEXTJS_PROJECT_PATH' && npm install && npm run dev && exec bash"

            # Create a new detached tmux session for Django
            tmux new-session -d -s "projects" "bash -c \"$django_commands\""
            
            # Split the window in the new session and run Next.js
            tmux split-window -h -t "projects" "bash -c \"$nextjs_commands\""
            
            # Attach to the newly created and configured session
            tmux attach-session -t "projects"

            break
            ;;
        4)
            echo "Exiting."
            exit 0
            ;;
        *)
            echo "Invalid option. Please enter a number between 1 and 4."
            ;;
    esac
done

