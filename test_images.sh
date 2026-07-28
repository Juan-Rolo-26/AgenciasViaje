#!/bin/bash
urls=(
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80"
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80"
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80"
  "https://images.unsplash.com/photo-1501594907296-3398c8c2ec10?w=1920&q=80"
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80"
  "https://images.unsplash.com/photo-1534008897995-281b3793f0b2?w=1920&q=80"
  "https://images.unsplash.com/photo-1505832018823-50331d70d237?w=1920&q=80"
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=80"
  "https://images.unsplash.com/photo-1515542718151-14c1cdcd26b1?w=1920&q=80"
)
for url in "${urls[@]}"; do
  status=$(curl -o /dev/null -s -w "%{http_code}\n" "$url")
  echo "$status $url"
done
