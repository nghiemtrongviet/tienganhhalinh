@echo off
rem Mo web hoc tieng Anh Business Partner A1 tren trinh duyet (can Python).
cd /d "%~dp0"
start "" http://127.0.0.1:8765/
python -m http.server 8765 --bind 127.0.0.1
