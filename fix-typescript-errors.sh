#!/bin/bash

# Fix Spinner size="large" to size="lg"
find ./src -type f -name "*.tsx" -exec sed -i 's/size="large"/size="lg"/g' {} \;

# Fix Alert type="error" to variant="error" and add div children
find ./src -type f -name "*.tsx" -exec sed -i 's/Alert type="error"/Alert variant="error"/g' {} \;
find ./src -type f -name "*.tsx" -exec sed -i 's/Alert type="success"/Alert variant="success"/g' {} \;
find ./src -type f -name "*.tsx" -exec sed -i 's/Alert type="warning"/Alert variant="warning"/g' {} \;
find ./src -type f -name "*.tsx" -exec sed -i 's/Alert type="info"/Alert variant="info"/g' {} \;

# Add div children to Alert components that don't have them
# This is more complex and might need manual intervention