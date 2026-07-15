#!/bin/sh
# husky.sh

# Tab check
if [ -n "$HUSKY_DEBUG" ]; then
  echo "husky: husky.sh \$0=$0"
fi

# Source .huskyrc if it exists
if [ -f "$HOME/.huskyrc" ]; then
  . "$HOME/.huskyrc"
fi

# Run hook
if [ -f "$1" ]; then
  . "$1"
fi
