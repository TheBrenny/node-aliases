@echo off
setlocal enableextensions

FOR /F "tokens=*" %%g IN ( 'cd' ) do ( set _CD=%%g )

IF "%1"=="-" set _CD=%_CD:\=\\%
IF "%1"=="--" set _CD=%_CD:\=\\%
IF "%1"=="-s" set _CD=%_CD:\=\\%
IF "%1"=="--slash" set _CD=%_CD:\=\\%

echo %_CD%

@echo on