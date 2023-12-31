#!/bin/bash

# Check if SSH agent is running
if [ -z "$SSH_AUTH_SOCK" ]; then
  # Start SSH agent and set SSH_AUTH_SOCK variable
  eval $(ssh-agent)
fi

# Check if SSH key is added
if ! ssh-add -l | grep -q '~/.ssh/gh_key'; then
  # Add SSH key to agent
  ssh-add ~/.ssh/gh_key
fi

# Change to the desired directory
cd /var/www/app/

# Run Git pull command
git pull origin main --ff-only