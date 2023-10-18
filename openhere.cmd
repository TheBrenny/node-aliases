@echo off
IF [%1]==[] (
    code -r .
) ELSE (
    code -r %*
)
@echo on