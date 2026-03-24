@REM DWIAGUS Website Management Script (Windows)
@REM Usage: manage.bat <command>

@echo off
setlocal enabledelayedexpansion

set "SITE_ROOT=%CD%"
set "ARTICLES_DIR=%SITE_ROOT%\artikel"
set "EBOOK_DIR=%SITE_ROOT%\ebook"

if "%1"=="" (
    call :show_menu
) else (
    call :%1
)

exit /b 0

:show_menu
echo ========== DWIAGUS Website Manager ==========
echo.
echo 1. Start Local Server
echo 2. View Statistics
echo 3. List Articles
echo 4. List E-Books
echo 5. Show Help
echo 6. Exit
echo.
pause

:start_server
echo Starting local server...
echo Serving at http://localhost:8000
echo Press Ctrl+C to stop
echo.
python -m http.server 8000 --directory "%SITE_ROOT%"
exit /b 0

:view_stats
echo.
echo ========== Website Statistics ==========
echo Location: %SITE_ROOT%
echo.

REM Count HTML files
setlocal enabledelayedexpansion
set count=0
for /r "%SITE_ROOT%" %%f in (*.html) do (
    set /a count+=1
)
echo Total HTML files: !count!
echo.

echo Articles found in:
cd /d "%ARTICLES_DIR%" 2>nul && (
    dir /s /b *.html | find ".html"
    cd /d "%SITE_ROOT%"
) || echo  (No articles directory)

echo.
goto :eof

:list_articles
echo.
echo ========== Articles ==========
dir /s "%ARTICLES_DIR%\*.html" 2>nul || echo No articles found
goto :eof

:list_ebooks
echo.
echo ========== E-Books ==========
dir /s "%EBOOK_DIR%\*.html" 2>nul || echo No e-books found
goto :eof

:show_help
echo.
echo ========== Help ==========
echo.
echo Commands:
echo   manage.bat                - Show this menu
echo   manage.bat start_server   - Start development server
echo   manage.bat view_stats     - Show website statistics
echo   manage.bat list_articles  - List all articles
echo   manage.bat list_ebooks    - List all e-books
echo.
echo Requirements:
echo   - Python 3.x (for local server)
echo   - Windows 10 or later
echo.
goto :eof
