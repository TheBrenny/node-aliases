@echo off

git add --all
git commit -m "initial commit"
FOR /f "delims=" %%r in ('git remote') do if NOT "%%r" == "" git push

@echo on