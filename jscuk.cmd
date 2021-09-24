@ECHO off
SETLOCAL

SET curdir=%~dp0
SET fileCalled=%~n0

SET "_prog=node"
SET PATHEXT=%PATHEXT:;.JS;=;%

"%_prog%"  "%curdir%\js\%fileCalled%.js" %*
ENDLOCAL
EXIT /b %errorlevel%