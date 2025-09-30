@echo off
echo ========================================
echo   GP360 - Solucion de Servicio Biometrico
echo ========================================
echo.

echo Verificando el servicio DigitalPersona...
sc query "DigitalPersona Lite Client Service" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] El servicio DigitalPersona Lite Client no esta instalado.
    echo Por favor, instale DigitalPersona Lite Client primero.
    pause
    exit /b 1
)

echo.
echo Deteniendo el servicio si esta en ejecucion...
net stop "DigitalPersona Lite Client Service" >nul 2>&1

echo Iniciando el servicio...
net start "DigitalPersona Lite Client Service"
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo iniciar el servicio. Intentando con permisos de administrador...
    echo.
    echo Este script necesita ejecutarse como Administrador.
    echo Haga clic derecho en el archivo y seleccione "Ejecutar como administrador"
    pause
    exit /b 1
)

echo.
echo [OK] Servicio iniciado correctamente.
echo.

echo Verificando conexion al puerto 64249...
netstat -an | findstr :64249 >nul
if %errorlevel% equ 0 (
    echo [OK] El servicio esta escuchando en el puerto 64249
) else (
    echo [ADVERTENCIA] El puerto 64249 no parece estar activo.
    echo Espere 5 segundos para que el servicio se inicialice completamente...
    timeout /t 5 /nobreak >nul
    netstat -an | findstr :64249 >nul
    if %errorlevel% equ 0 (
        echo [OK] El servicio ahora esta escuchando en el puerto 64249
    ) else (
        echo [ERROR] El servicio no esta escuchando en el puerto esperado.
        echo Puede haber un problema con la instalacion.
    )
)

echo.
echo ========================================
echo   Verificacion de Firewall
echo ========================================
echo.

echo Agregando excepcion al Firewall de Windows...
netsh advfirewall firewall add rule name="DigitalPersona Service" dir=in action=allow protocol=TCP localport=64249 >nul 2>&1
netsh advfirewall firewall add rule name="DigitalPersona Service" dir=out action=allow protocol=TCP localport=64249 >nul 2>&1
echo [OK] Reglas de firewall configuradas.

echo.
echo ========================================
echo   Resumen
echo ========================================
echo.
echo El servicio DigitalPersona ha sido reiniciado y configurado.
echo.
echo Proximos pasos:
echo 1. Abra su navegador web (Chrome, Firefox o Edge)
echo 2. Navegue a: http://localhost:5173/test-fingerprint.html
echo 3. Haga clic en "Verificar Sistema"
echo 4. Todos los items deberian mostrar check verde
echo.
echo Si continua teniendo problemas:
echo - Reinicie su computadora
echo - Desinstale y reinstale DigitalPersona Lite Client
echo - Verifique que el lector USB este conectado correctamente
echo.
pause