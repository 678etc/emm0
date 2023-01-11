git checkout --orphan  new_branch

git add -A

git commit -am "initial commit"

git branch -D main

git branch -m main

git push -f origin main