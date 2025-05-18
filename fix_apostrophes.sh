#!/bin/bash
# Script to fix unescaped apostrophes in string literals

# Find all .tsx and .ts files
find src -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  # Replace I'll with I\'ll
  sed -i "s/I'll/I\\'ll/g" "$file"
  
  # Replace we'll with we\'ll
  sed -i "s/we'll/we\\'ll/g" "$file"
  
  # Replace you'll with you\'ll
  sed -i "s/you'll/you\\'ll/g" "$file"
  
  # Replace they'll with they\'ll
  sed -i "s/they'll/they\\'ll/g" "$file"
  
  # Replace That's with That\'s
  sed -i "s/That's/That\\'s/g" "$file"
  
  # Replace it's with it\'s
  sed -i "s/it's/it\\'s/g" "$file"
  
  # Replace I'm with I\'m
  sed -i "s/I'm/I\\'m/g" "$file"
  
  # Replace we're with we\'re
  sed -i "s/we're/we\\'re/g" "$file"
  
  # Replace you're with you\'re
  sed -i "s/you're/you\\'re/g" "$file"
  
  # Replace they're with they\'re
  sed -i "s/they're/they\\'re/g" "$file"
  
  # Replace don't with don\'t
  sed -i "s/don't/don\\'t/g" "$file"
  
  # Replace can't with can\'t
  sed -i "s/can't/can\\'t/g" "$file"
  
  # Replace won't with won\'t
  sed -i "s/won't/won\\'t/g" "$file"
  
  # Replace isn't with isn\'t
  sed -i "s/isn't/isn\\'t/g" "$file"
  
  # Replace aren't with aren\'t
  sed -i "s/aren't/aren\\'t/g" "$file"
  
  # Replace wasn't with wasn\'t
  sed -i "s/wasn't/wasn\\'t/g" "$file"
  
  # Replace weren't with weren\'t
  sed -i "s/weren't/weren\\'t/g" "$file"
  
  # Replace hasn't with hasn\'t
  sed -i "s/hasn't/hasn\\'t/g" "$file"
  
  # Replace haven't with haven\'t
  sed -i "s/haven't/haven\\'t/g" "$file"
  
  # Replace hadn't with hadn\'t
  sed -i "s/hadn't/hadn\\'t/g" "$file"
  
  # Replace doesn't with doesn\'t
  sed -i "s/doesn't/doesn\\'t/g" "$file"
  
  # Replace didn't with didn\'t
  sed -i "s/didn't/didn\\'t/g" "$file"
  
  # Replace wouldn't with wouldn\'t
  sed -i "s/wouldn't/wouldn\\'t/g" "$file"
  
  # Replace couldn't with couldn\'t
  sed -i "s/couldn't/couldn\\'t/g" "$file"
  
  # Replace shouldn't with shouldn\'t
  sed -i "s/shouldn't/shouldn\\'t/g" "$file"
  
  # Replace let's with let\'s
  sed -i "s/let's/let\\'s/g" "$file"
  
  # Replace what's with what\'s
  sed -i "s/what's/what\\'s/g" "$file"
  
  # Replace who's with who\'s
  sed -i "s/who's/who\\'s/g" "$file"
  
  # Replace where's with where\'s
  sed -i "s/where's/where\\'s/g" "$file"
  
  # Replace there's with there\'s
  sed -i "s/there's/there\\'s/g" "$file"
  
  # Replace here's with here\'s
  sed -i "s/here's/here\\'s/g" "$file"
  
  # Replace he's with he\'s
  sed -i "s/he's/he\\'s/g" "$file"
  
  # Replace she's with she\'s
  sed -i "s/she's/she\\'s/g" "$file"
  
  # Replace 's (possessive) with \'s
  sed -i "s/\([a-zA-Z]\)'s/\1\\'s/g" "$file"
  
  echo "Fixed apostrophes in $file"
done

echo "All apostrophes fixed!"
