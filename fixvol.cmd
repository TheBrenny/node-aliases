@echo off
call SetVol.exe report device Speakers (Surface Dock) >nul
call SetVol.exe %ERRORLEVEL% balance 80:100 device Speakers (Surface Dock) >nul
@echo on