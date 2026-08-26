#!/usr/bin/env bash
set -euo pipefail

# Roll back current branch (or provided branch) to the tagged stable release.
STABLE_TAG="${1:-stable-2026-08-18-instagram-eoex}"
TARGET_BRANCH="${2:-$(git branch --show-current)}"

if [[ -z "$TARGET_BRANCH" ]]; then
  echo "Unable to detect current branch. Pass branch as second argument."
  exit 1
fi

echo "Fetching latest refs and tags..."
git fetch origin --tags

echo "Checking out branch: $TARGET_BRANCH"
git checkout "$TARGET_BRANCH"

echo "Resetting $TARGET_BRANCH to $STABLE_TAG"
git reset --hard "$STABLE_TAG"

echo "Pushing rollback to origin/$TARGET_BRANCH"
git push --force-with-lease origin "$TARGET_BRANCH"

echo "Rollback complete: $TARGET_BRANCH -> $STABLE_TAG"
